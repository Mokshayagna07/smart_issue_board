import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp,
    getDoc
} from "firebase/firestore";
import { db } from "../firebase.config";

const ISSUES_COLLECTION = "issues";

export const issueService = {
    // Create a new issue in Real Firestore
    async createIssue(issueData) {
        try {
            const docRef = await addDoc(collection(db, ISSUES_COLLECTION), {
                ...issueData,
                createdAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating issue: ", error);
            throw error;
        }
    },

    // Get all issues from Real Firestore
    async getIssues() {
        try {
            const q = query(
                collection(db, ISSUES_COLLECTION),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert timestamp to Date object if exists
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
        } catch (error) {
            console.error("Error getting issues: ", error);
            throw error;
        }
    },

    // Get single issue
    async getIssue(id) {
        try {
            const docRef = doc(db, ISSUES_COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate() || new Date()
                };
            }
            return null;
        } catch (error) {
            console.error("Error getting issue: ", error);
            throw error;
        }
    },

    // Update issue status with validation
    async updateIssueStatus(id, newStatus, currentStatus) {
        // Validation: Cannot go from Open -> Done directly
        if (currentStatus === "Open" && newStatus === "Done") {
            throw new Error("Cannot move directly from Open to Done. Must go through In Progress.");
        }

        try {
            const issueRef = doc(db, ISSUES_COLLECTION, id);
            await updateDoc(issueRef, {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status: ", error);
            throw error;
        }
    },

    // Update full issue
    async updateIssue(id, data) {
        try {
            const issueRef = doc(db, ISSUES_COLLECTION, id);
            await updateDoc(issueRef, data);
        } catch (error) {
            console.error("Error updating issue: ", error);
            throw error;
        }
    },

    // Check for similar issues
    async findSimilarIssues(title) {
        try {
            // Fetch all docs to filter client side (appropriate for this scale)
            const q = query(collection(db, ISSUES_COLLECTION));
            const querySnapshot = await getDocs(q);
            const issues = querySnapshot.docs.map(doc => doc.data());

            const searchTitle = title.toLowerCase();

            return issues.filter(issue =>
                issue.title.toLowerCase().includes(searchTitle) ||
                searchTitle.includes(issue.title.toLowerCase())
            );
        } catch (error) {
            console.error("Error checking similar issues: ", error);
            return [];
        }
    }
};
