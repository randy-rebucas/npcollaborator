import { memberstack } from "@/config/memberstack-admin";

interface CreateMember {
  email: string;
  password: string;
  customFields?: object;
  metaData?: object;
  json?: object;
  loginRedirect?: string;
  plans?: {
    planId: string;
  }[];
}

interface UpdateMember {
  email?: string;
  customFields?: object;
  metaData?: object;
  json?: object;
  loginRedirect?: string;
}

interface PlanOperation {
  planId: string;
}

export class MemberstackAdminService {
  /**
   * Retrieves a member by their ID
   * @param memberId - The unique identifier of the member
   * @throws {Error} If member retrieval fails
   */
  static async getMemberById(memberId: string) {
    if (!memberId) throw new Error('Member ID is required');
    
    try {
      const member = await memberstack.members.retrieve({ id: memberId });
      return member;
    } catch (error) {
      console.error("Error getting member:", error);
      throw new Error(`Failed to retrieve member with ID ${memberId}`);
    }
  }

  // Get member by email
  static async getMemberByEmail(email: string) {
    try {
      const members = await memberstack.members.retrieve({ email });
      return members; // Returns the first match
    } catch (error) {
      console.error("Error searching member:", error);
      throw error;
    }
  }

  // Create member
  static async createMember(memberData: CreateMember) {
    try {
      const member = await memberstack.members.create(memberData);
      return member;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  }

  /**
   * Updates a member's information
   * @param memberId - The unique identifier of the member
   * @param updateData - The data to update
   * @throws {Error} If member update fails
   */
  static async updateMember(memberId: string, updateData: UpdateMember) {
    if (!memberId) throw new Error('Member ID is required');
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data is required');
    }

    try {
      const updated = await memberstack.members.update({
        id: memberId,
        data: updateData,
      });
      return updated;
    } catch (error) {
      console.error("Error updating member:", error);
      throw new Error(`Failed to update member with ID ${memberId}`);
    }
  }

  // Delete member
  static async deleteMember(memberId: string) {
    try {
      await memberstack.members.delete({ id: memberId });
      return true;
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  }

  /**
   * Adds a member to a plan
   * @param memberId - The unique identifier of the member
   * @param planId - The unique identifier of the plan
   * @throws {Error} If adding plan fails
   */
  static async addMemberToPlan(memberId: string, planId: string) {
    if (!memberId) throw new Error('Member ID is required');
    if (!planId) throw new Error('Plan ID is required');

    try {
      const updated = await memberstack.members.addFreePlan({
        id: memberId,
        data: { planId } as PlanOperation,
      });
      return updated;
    } catch (error) {
      console.error("Error adding plan to member:", error);
      throw new Error(`Failed to add plan ${planId} to member ${memberId}`);
    }
  }

  // Remove member from plan
  static async removeMemberFromPlan(memberId: string, planId: string) {
    try {
      const updated = await memberstack.members.removeFreePlan({
        id: memberId,
        data: {
          planId: planId,
        },
      });
      return updated;
    } catch (error) {
      console.error("Error removing plan from member:", error);
      throw error;
    }
  }

  /**
   * Lists all members with pagination
   * @param after - The pagination cursor
   * @param limit - The number of members to return
   * @throws {Error} If listing members fails
   */
  static async listMembers(after = 1, limit = 10) {
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    try {
      const members = await memberstack.members.list({
        after,
        limit,
      });
      return members;
    } catch (error) {
      console.error("Error listing members:", error);
      throw new Error('Failed to list members');
    }
  }
}
