// T031: Tournament Firebase service
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
  startAfter,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
  Tournament,
  CreateTournamentRequest,
  UpdateTournamentRequest,
  TournamentResponse,
  TournamentListResponse,
  TournamentQueryParams,
} from '../types/tournament';
import { authService } from './auth.service';

export class TournamentService {
  private readonly collectionName = 'tournaments';

  /**
   * Create a new tournament
   */
  async createTournament(tournamentData: CreateTournamentRequest): Promise<TournamentResponse> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    try {
      const tournamentDoc = {
        name: tournamentData.name,
        description: tournamentData.description || null,
        organizer: currentUser.uid,
        organizerEmail: currentUser.email!,
        maxParticipants: tournamentData.maxParticipants || null,
        registrationOpen: true,
        registrationDeadline: tournamentData.registrationDeadline
          ? Timestamp.fromDate(new Date(tournamentData.registrationDeadline))
          : null,
        startDate: tournamentData.startDate
          ? Timestamp.fromDate(new Date(tournamentData.startDate))
          : null,
        endDate: tournamentData.endDate
          ? Timestamp.fromDate(new Date(tournamentData.endDate))
          : null,
        isPublic: tournamentData.isPublic,
        participantCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), tournamentDoc);

      // Get the created document to return
      const createdDoc = await getDoc(docRef);
      const data = createdDoc.data()!;

      return {
        tournament: {
          id: docRef.id,
          name: data.name,
          description: data.description,
          organizer: data.organizer,
          organizerEmail: data.organizerEmail,
          maxParticipants: data.maxParticipants,
          registrationOpen: data.registrationOpen,
          registrationDeadline: data.registrationDeadline?.toDate().toISOString(),
          startDate: data.startDate?.toDate().toISOString(),
          endDate: data.endDate?.toDate().toISOString(),
          isPublic: data.isPublic,
          participantCount: data.participantCount,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
        },
      };
    } catch (error: any) {
      console.error('Error creating tournament:', error);
      throw new Error('Failed to create tournament');
    }
  }

  /**
   * Get tournament by ID
   */
  async getTournament(tournamentId: string): Promise<TournamentResponse> {
    try {
      const docRef = doc(db, this.collectionName, tournamentId);
      const tournamentDoc = await getDoc(docRef);

      if (!tournamentDoc.exists()) {
        throw new Error('Tournament not found');
      }

      const data = tournamentDoc.data();
      const currentUser = authService.getCurrentUser();

      // Check access permissions for private tournaments
      if (!data.isPublic && (!currentUser || currentUser.uid !== data.organizer)) {
        throw new Error('Access denied');
      }

      return {
        tournament: {
          id: tournamentDoc.id,
          name: data.name,
          description: data.description,
          organizer: data.organizer,
          organizerEmail: data.organizerEmail,
          maxParticipants: data.maxParticipants,
          registrationOpen: data.registrationOpen,
          registrationDeadline: data.registrationDeadline?.toDate().toISOString(),
          startDate: data.startDate?.toDate().toISOString(),
          endDate: data.endDate?.toDate().toISOString(),
          isPublic: data.isPublic,
          participantCount: data.participantCount,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
        },
      };
    } catch (error: any) {
      console.error('Error fetching tournament:', error);
      if (error.message === 'Tournament not found' || error.message === 'Access denied') {
        throw error;
      }
      throw new Error('Failed to fetch tournament');
    }
  }

  /**
   * List tournaments with filtering and pagination
   */
  async listTournaments(params: TournamentQueryParams = {}): Promise<TournamentListResponse> {
    try {
      let q = collection(db, this.collectionName);
      let queryConstraints: any[] = [];

      // Apply filters
      if (params.public !== undefined) {
        queryConstraints.push(where('isPublic', '==', params.public));
      }

      if (params.organizer) {
        queryConstraints.push(where('organizer', '==', params.organizer));
      }

      if (params.registrationOpen !== undefined) {
        queryConstraints.push(where('registrationOpen', '==', params.registrationOpen));
      }

      // Order by creation date (newest first)
      queryConstraints.push(orderBy('createdAt', 'desc'));

      // Apply limit
      const limitValue = Math.min(params.limit || 25, 50);
      queryConstraints.push(firestoreLimit(limitValue + 1)); // +1 to check if there are more

      // Apply cursor for pagination
      if (params.cursor) {
        // In a real implementation, cursor would be a document snapshot
        // For now, we'll implement basic pagination
        queryConstraints.push(startAfter(params.cursor));
      }

      const finalQuery = query(q, ...queryConstraints);
      const snapshot = await getDocs(finalQuery);

      const tournaments = snapshot.docs.slice(0, limitValue).map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          organizer: data.organizer,
          organizerEmail: data.organizerEmail,
          maxParticipants: data.maxParticipants,
          registrationOpen: data.registrationOpen,
          registrationDeadline: data.registrationDeadline?.toDate().toISOString(),
          startDate: data.startDate?.toDate().toISOString(),
          endDate: data.endDate?.toDate().toISOString(),
          isPublic: data.isPublic,
          participantCount: data.participantCount,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
        };
      });

      const hasMore = snapshot.docs.length > limitValue;
      const nextCursor = hasMore ? snapshot.docs[limitValue - 1].id : undefined;

      return {
        tournaments,
        nextCursor,
        hasMore,
      };
    } catch (error: any) {
      console.error('Error listing tournaments:', error);
      throw new Error('Failed to list tournaments');
    }
  }

  /**
   * Update tournament (organizer only)
   */
  async updateTournament(
    tournamentId: string,
    updates: UpdateTournamentRequest
  ): Promise<TournamentResponse> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    try {
      const docRef = doc(db, this.collectionName, tournamentId);
      const tournamentDoc = await getDoc(docRef);

      if (!tournamentDoc.exists()) {
        throw new Error('Tournament not found');
      }

      const tournamentData = tournamentDoc.data();
      if (tournamentData.organizer !== currentUser.uid) {
        throw new Error('Only organizer can update tournament');
      }

      const updateData: any = {
        updatedAt: serverTimestamp(),
      };

      // Apply updates
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.maxParticipants !== undefined) updateData.maxParticipants = updates.maxParticipants;
      if (updates.registrationOpen !== undefined) updateData.registrationOpen = updates.registrationOpen;
      if (updates.isPublic !== undefined) updateData.isPublic = updates.isPublic;

      if (updates.registrationDeadline !== undefined) {
        updateData.registrationDeadline = updates.registrationDeadline
          ? Timestamp.fromDate(new Date(updates.registrationDeadline))
          : null;
      }

      if (updates.startDate !== undefined) {
        updateData.startDate = updates.startDate
          ? Timestamp.fromDate(new Date(updates.startDate))
          : null;
      }

      if (updates.endDate !== undefined) {
        updateData.endDate = updates.endDate
          ? Timestamp.fromDate(new Date(updates.endDate))
          : null;
      }

      await updateDoc(docRef, updateData);

      // Return updated tournament
      return this.getTournament(tournamentId);
    } catch (error: any) {
      console.error('Error updating tournament:', error);
      if (error.message === 'Tournament not found' || error.message === 'Only organizer can update tournament') {
        throw error;
      }
      throw new Error('Failed to update tournament');
    }
  }

  /**
   * Delete tournament (organizer only)
   */
  async deleteTournament(tournamentId: string): Promise<void> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    try {
      const docRef = doc(db, this.collectionName, tournamentId);
      const tournamentDoc = await getDoc(docRef);

      if (!tournamentDoc.exists()) {
        throw new Error('Tournament not found');
      }

      const tournamentData = tournamentDoc.data();
      if (tournamentData.organizer !== currentUser.uid) {
        throw new Error('Only organizer can delete tournament');
      }

      // TODO: Delete all registrations for this tournament
      // This would be done in a Cloud Function in production
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error('Error deleting tournament:', error);
      if (error.message === 'Tournament not found' || error.message === 'Only organizer can delete tournament') {
        throw error;
      }
      throw new Error('Failed to delete tournament');
    }
  }

  /**
   * Update participant count (called when registrations change)
   */
  async updateParticipantCount(tournamentId: string, count: number): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, tournamentId);
      await updateDoc(docRef, {
        participantCount: count,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error updating participant count:', error);
      throw new Error('Failed to update participant count');
    }
  }

  /**
   * Get tournaments for current user
   */
  async getUserTournaments(): Promise<TournamentListResponse> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    return this.listTournaments({ organizer: currentUser.uid });
  }

  /**
   * Get public tournaments
   */
  async getPublicTournaments(params: TournamentQueryParams = {}): Promise<TournamentListResponse> {
    return this.listTournaments({ ...params, public: true });
  }

  /**
   * Subscribe to tournament changes
   */
  onTournamentChange(
    tournamentId: string,
    callback: (tournament: Tournament | null) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, tournamentId);

    return onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const tournament: Tournament = {
            id: doc.id,
            name: data.name,
            description: data.description,
            organizer: data.organizer,
            organizerEmail: data.organizerEmail,
            maxParticipants: data.maxParticipants,
            registrationOpen: data.registrationOpen,
            registrationDeadline: data.registrationDeadline?.toDate().toISOString(),
            startDate: data.startDate?.toDate().toISOString(),
            endDate: data.endDate?.toDate().toISOString(),
            isPublic: data.isPublic,
            participantCount: data.participantCount,
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.updatedAt.toDate().toISOString(),
          };
          callback(tournament);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error in tournament listener:', error);
        callback(null);
      }
    );
  }

  /**
   * Subscribe to tournaments list changes
   */
  onTournamentsChange(
    params: TournamentQueryParams = {},
    callback: (tournaments: Tournament[]) => void
  ): Unsubscribe {
    const q = collection(db, this.collectionName);
    const queryConstraints: any[] = [];

    // Apply filters
    if (params.public !== undefined) {
      queryConstraints.push(where('isPublic', '==', params.public));
    }

    if (params.organizer) {
      queryConstraints.push(where('organizer', '==', params.organizer));
    }

    if (params.registrationOpen !== undefined) {
      queryConstraints.push(where('registrationOpen', '==', params.registrationOpen));
    }

    // Order by creation date (newest first)
    queryConstraints.push(orderBy('createdAt', 'desc'));

    // Apply limit
    const limitValue = Math.min(params.limit || 25, 50);
    queryConstraints.push(firestoreLimit(limitValue));

    const finalQuery = query(q, ...queryConstraints);

    return onSnapshot(
      finalQuery,
      (snapshot) => {
        const tournaments = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            organizer: data.organizer,
            organizerEmail: data.organizerEmail,
            maxParticipants: data.maxParticipants,
            registrationOpen: data.registrationOpen,
            registrationDeadline: data.registrationDeadline?.toDate().toISOString(),
            startDate: data.startDate?.toDate().toISOString(),
            endDate: data.endDate?.toDate().toISOString(),
            isPublic: data.isPublic,
            participantCount: data.participantCount,
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.updatedAt.toDate().toISOString(),
          };
        });
        callback(tournaments);
      },
      (error) => {
        console.error('Error in tournaments list listener:', error);
        callback([]);
      }
    );
  }

  /**
   * Subscribe to user's tournaments changes
   */
  onUserTournamentsChange(callback: (tournaments: Tournament[]) => void): Unsubscribe {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      callback([]);
      return () => {}; // Return empty unsubscribe function
    }

    return this.onTournamentsChange({ organizer: currentUser.uid }, callback);
  }

  /**
   * Subscribe to public tournaments changes
   */
  onPublicTournamentsChange(
    params: TournamentQueryParams = {},
    callback: (tournaments: Tournament[]) => void
  ): Unsubscribe {
    return this.onTournamentsChange({ ...params, public: true }, callback);
  }
}

// Export singleton instance
export const tournamentService = new TournamentService();