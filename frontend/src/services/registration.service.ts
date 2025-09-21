// T032: Registration Firebase service
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
  CoachRegistration,
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
  RegistrationResponse,
  RegistrationListResponse,
  RegistrationQueryParams,
} from '../types/registration';
import { RegistrationStatus } from '../types/enums';
import { authService } from './auth.service';
import { tournamentService } from './tournament.service';

export class RegistrationService {
  /**
   * Create a new registration for a tournament
   */
  async createRegistration(
    tournamentId: string,
    registrationData: CreateRegistrationRequest
  ): Promise<RegistrationResponse> {
    try {
      // Check if tournament exists and registration is open
      const tournament = await tournamentService.getTournament(tournamentId);
      if (!tournament.tournament.registrationOpen) {
        throw new Error('Registration is closed for this tournament');
      }

      // Check participant limit
      if (
        tournament.tournament.maxParticipants &&
        tournament.tournament.participantCount >= tournament.tournament.maxParticipants
      ) {
        throw new Error('Tournament is full');
      }

      // Check for duplicate alias
      await this.checkDuplicateAlias(tournamentId, registrationData.alias);

      // Check for duplicate email
      await this.checkDuplicateEmail(tournamentId, registrationData.email);

      const currentUser = authService.getCurrentUser();
      const registrationDoc = {
        tournamentId,
        alias: registrationData.alias,
        email: registrationData.email,
        teamRace: registrationData.teamRace,
        fullName: registrationData.fullName || null,
        nafNumber: registrationData.nafNumber || null,
        teamName: registrationData.teamName || null,
        userId: currentUser?.uid || null,
        isAnonymous: !currentUser,
        registeredAt: serverTimestamp(),
        status: RegistrationStatus.PENDING,
      };

      const collectionRef = collection(db, 'tournaments', tournamentId, 'registrations');
      const docRef = await addDoc(collectionRef, registrationDoc);

      // Update tournament participant count
      const currentCount = tournament.tournament.participantCount + 1;
      await tournamentService.updateParticipantCount(tournamentId, currentCount);

      // Get the created registration
      const createdDoc = await getDoc(docRef);
      const data = createdDoc.data()!;

      return {
        registration: {
          id: docRef.id,
          tournamentId: data.tournamentId,
          alias: data.alias,
          email: data.email,
          teamRace: data.teamRace,
          fullName: data.fullName,
          nafNumber: data.nafNumber,
          teamName: data.teamName,
          userId: data.userId,
          isAnonymous: data.isAnonymous,
          registeredAt: data.registeredAt.toDate().toISOString(),
          status: data.status,
        },
      };
    } catch (error: any) {
      console.error('Error creating registration:', error);
      throw error;
    }
  }

  /**
   * Get registration by ID
   */
  async getRegistration(tournamentId: string, registrationId: string): Promise<RegistrationResponse> {
    try {
      const docRef = doc(db, 'tournaments', tournamentId, 'registrations', registrationId);
      const registrationDoc = await getDoc(docRef);

      if (!registrationDoc.exists()) {
        throw new Error('Registration not found');
      }

      const data = registrationDoc.data();
      const currentUser = authService.getCurrentUser();

      // Check access permissions
      const isOrganizer = await this.isUserTournamentOrganizer(tournamentId, currentUser?.uid);
      const isOwner = currentUser && data.userId === currentUser.uid;

      if (!isOrganizer && !isOwner) {
        throw new Error('Access denied');
      }

      return {
        registration: {
          id: registrationDoc.id,
          tournamentId: data.tournamentId,
          alias: data.alias,
          email: data.email,
          teamRace: data.teamRace,
          fullName: data.fullName,
          nafNumber: data.nafNumber,
          teamName: data.teamName,
          userId: data.userId,
          isAnonymous: data.isAnonymous,
          registeredAt: data.registeredAt.toDate().toISOString(),
          status: data.status,
        },
      };
    } catch (error: any) {
      console.error('Error fetching registration:', error);
      throw error;
    }
  }

  /**
   * List registrations for a tournament (organizer only)
   */
  async listRegistrations(
    tournamentId: string,
    params: RegistrationQueryParams = {}
  ): Promise<RegistrationListResponse> {
    const currentUser = authService.getCurrentUser();
    const isOrganizer = await this.isUserTournamentOrganizer(tournamentId, currentUser?.uid);

    if (!isOrganizer) {
      throw new Error('Only organizer can view registrations');
    }

    try {
      let q = collection(db, 'tournaments', tournamentId, 'registrations');
      let queryConstraints: any[] = [];

      // Apply filters
      if (params.status) {
        queryConstraints.push(where('status', '==', params.status));
      }

      // Order by registration date
      queryConstraints.push(orderBy('registeredAt', 'desc'));

      // Apply limit
      const limitValue = Math.min(params.limit || 25, 50);
      queryConstraints.push(firestoreLimit(limitValue + 1));

      const finalQuery = query(q, ...queryConstraints);
      const snapshot = await getDocs(finalQuery);

      const registrations = snapshot.docs.slice(0, limitValue).map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tournamentId: data.tournamentId,
          alias: data.alias,
          email: data.email,
          teamRace: data.teamRace,
          fullName: data.fullName,
          nafNumber: data.nafNumber,
          teamName: data.teamName,
          userId: data.userId,
          isAnonymous: data.isAnonymous,
          registeredAt: data.registeredAt.toDate().toISOString(),
          status: data.status,
        };
      });

      const hasMore = snapshot.docs.length > limitValue;
      const nextCursor = hasMore ? snapshot.docs[limitValue - 1].id : undefined;

      return {
        registrations,
        nextCursor,
        hasMore,
      };
    } catch (error: any) {
      console.error('Error listing registrations:', error);
      throw new Error('Failed to list registrations');
    }
  }

  /**
   * Update registration
   */
  async updateRegistration(
    tournamentId: string,
    registrationId: string,
    updates: UpdateRegistrationRequest
  ): Promise<RegistrationResponse> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    try {
      const docRef = doc(db, 'tournaments', tournamentId, 'registrations', registrationId);
      const registrationDoc = await getDoc(docRef);

      if (!registrationDoc.exists()) {
        throw new Error('Registration not found');
      }

      const registrationData = registrationDoc.data();
      const isOrganizer = await this.isUserTournamentOrganizer(tournamentId, currentUser.uid);
      const isOwner = registrationData.userId === currentUser.uid;

      if (!isOrganizer && !isOwner) {
        throw new Error('Access denied');
      }

      // Only organizer can update status
      if (updates.status && !isOrganizer) {
        throw new Error('Only organizer can update status');
      }

      const updateData: any = {};

      // Apply updates
      if (updates.alias !== undefined) {
        await this.checkDuplicateAlias(tournamentId, updates.alias, registrationId);
        updateData.alias = updates.alias;
      }
      if (updates.teamRace !== undefined) updateData.teamRace = updates.teamRace;
      if (updates.fullName !== undefined) updateData.fullName = updates.fullName;
      if (updates.nafNumber !== undefined) updateData.nafNumber = updates.nafNumber;
      if (updates.teamName !== undefined) updateData.teamName = updates.teamName;
      if (updates.status !== undefined) updateData.status = updates.status;

      await updateDoc(docRef, updateData);

      // Return updated registration
      return this.getRegistration(tournamentId, registrationId);
    } catch (error: any) {
      console.error('Error updating registration:', error);
      throw error;
    }
  }

  /**
   * Delete/cancel registration
   */
  async deleteRegistration(tournamentId: string, registrationId: string): Promise<void> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    try {
      const docRef = doc(db, 'tournaments', tournamentId, 'registrations', registrationId);
      const registrationDoc = await getDoc(docRef);

      if (!registrationDoc.exists()) {
        throw new Error('Registration not found');
      }

      const registrationData = registrationDoc.data();
      const isOrganizer = await this.isUserTournamentOrganizer(tournamentId, currentUser.uid);
      const isOwner = registrationData.userId === currentUser.uid;

      if (!isOrganizer && !isOwner) {
        throw new Error('Access denied');
      }

      await deleteDoc(docRef);

      // Update tournament participant count
      const tournament = await tournamentService.getTournament(tournamentId);
      const newCount = Math.max(0, tournament.tournament.participantCount - 1);
      await tournamentService.updateParticipantCount(tournamentId, newCount);
    } catch (error: any) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }

  /**
   * Get user's registrations
   */
  async getUserRegistrations(): Promise<CoachRegistration[]> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    // This would require a compound query across all tournaments
    // In production, we'd use a separate collection or Cloud Function
    throw new Error('User registrations not implemented yet');
  }

  /**
   * Check for duplicate alias in tournament
   */
  private async checkDuplicateAlias(
    tournamentId: string,
    alias: string,
    excludeRegistrationId?: string
  ): Promise<void> {
    const q = query(
      collection(db, 'tournaments', tournamentId, 'registrations'),
      where('alias', '==', alias)
    );
    const snapshot = await getDocs(q);

    const duplicates = snapshot.docs.filter(doc => doc.id !== excludeRegistrationId);
    if (duplicates.length > 0) {
      throw new Error('Alias already taken for this tournament');
    }
  }

  /**
   * Check for duplicate email in tournament
   */
  private async checkDuplicateEmail(
    tournamentId: string,
    email: string,
    excludeRegistrationId?: string
  ): Promise<void> {
    const q = query(
      collection(db, 'tournaments', tournamentId, 'registrations'),
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);

    const duplicates = snapshot.docs.filter(doc => doc.id !== excludeRegistrationId);
    if (duplicates.length > 0) {
      throw new Error('Email already registered for this tournament');
    }
  }

  /**
   * Check if user is tournament organizer
   */
  private async isUserTournamentOrganizer(tournamentId: string, userId?: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const tournament = await tournamentService.getTournament(tournamentId);
      return tournament.tournament.organizer === userId;
    } catch {
      return false;
    }
  }

  /**
   * Subscribe to tournament registrations changes
   */
  onTournamentRegistrationsChange(
    tournamentId: string,
    callback: (registrations: CoachRegistration[]) => void
  ): Unsubscribe {
    const q = collection(db, 'tournaments');
    const finalQuery = query(
      q,
      where('tournamentId', '==', tournamentId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(
      finalQuery,
      (snapshot) => {
        const registrations = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            tournamentId: data.tournamentId,
            userId: data.userId,
            alias: data.alias || data.coachName,
            email: data.email || data.contactEmail,
            fullName: data.fullName,
            nafNumber: data.nafNumber,
            teamName: data.teamName,
            teamRace: data.teamRace,
            status: data.status,
            isAnonymous: data.isAnonymous,
            registeredAt: data.registeredAt || data.createdAt,
          };
        });
        callback(registrations);
      },
      (error) => {
        console.error('Error in tournament registrations listener:', error);
        callback([]);
      }
    );
  }

  /**
   * Subscribe to user's registrations changes
   */
  onUserRegistrationsChange(callback: (registrations: CoachRegistration[]) => void): Unsubscribe {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      callback([]);
      return () => {}; // Return empty unsubscribe function
    }

    const q = collection(db, 'tournaments');
    const finalQuery = query(
      q,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      finalQuery,
      (snapshot) => {
        const registrations = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            tournamentId: data.tournamentId,
            userId: data.userId,
            alias: data.alias || data.coachName,
            email: data.email || data.contactEmail,
            fullName: data.fullName,
            nafNumber: data.nafNumber,
            teamName: data.teamName,
            teamRace: data.teamRace,
            status: data.status,
            isAnonymous: data.isAnonymous,
            registeredAt: data.registeredAt || data.createdAt,
          };
        });
        callback(registrations);
      },
      (error) => {
        console.error('Error in user registrations listener:', error);
        callback([]);
      }
    );
  }

  /**
   * Subscribe to single registration changes
   */
  onRegistrationChange(
    registrationId: string,
    callback: (registration: CoachRegistration | null) => void
  ): Unsubscribe {
    const docRef = doc(db, 'tournaments', registrationId);

    return onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const registration: CoachRegistration = {
            id: doc.id,
            tournamentId: data.tournamentId,
            userId: data.userId,
            alias: data.alias || data.coachName,
            email: data.email || data.contactEmail,
            teamRace: data.teamRace,
            fullName: data.fullName,
            nafNumber: data.nafNumber,
            teamName: data.teamName,
            status: data.status,
            isAnonymous: data.isAnonymous,
            registeredAt: data.registeredAt || data.createdAt,
          };
          callback(registration);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error in registration listener:', error);
        callback(null);
      }
    );
  }
}

// Export singleton instance
export const registrationService = new RegistrationService();