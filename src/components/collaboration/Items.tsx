'use client';

import Accept from "./actions/Accept";
import WithdrawOffer from "./actions/offer/WithdrawOffer";
import CancelOffer from "./actions/offer/CancelOffer";
import SendOffer from "./actions/offer/SendOffer";
import Remove from "./actions/Remove";
import Decline from "./actions/Decline";    
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useCallback, useState } from "react";
import { CollaborationSkeleton } from "../Skeletons";

type Collaborator = {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'pending' | 'offered' | 'accepted' | 'declined' | 'cancelled' | 'withdrawn';
    avatarUrl?: string;
};

const EmptyCollaborator = ({ type }: { type: 'active' | 'request' }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
            <h3 className="mt-2 text-lg font-medium text-gray-900">
                {type === 'active'
                    ? 'No active collaborators'
                    : 'No pending requests'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                {type === 'active'
                    ? "You haven't added any collaborators yet."
                    : "You don't have any pending collaboration requests."}
            </p>
        </div>
    </div>
)

export default function Items({ type }: { type: 'active' | 'request' }) {
    const [isLoading, setIsLoading] = useState(false);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

    const fetchCollaborators = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/collaborators/${type === 'active' ? 'active' : 'request'}?status=${type}`);
            if (!response.ok) throw new Error('Failed to fetch collaborators');
            const data = await response.json();
            setCollaborators(data);
        } catch (err) {
            console.error('Error fetching user:', err);
            toast.error('Failed to load collaborators');
        } finally {
            setIsLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchCollaborators();
    }, [fetchCollaborators]);

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
                <CollaborationSkeleton /> 
            ) : collaborators.length === 0 ? (
                <EmptyCollaborator type={type} />
            ) : (
                collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="bg-card shadow rounded-lg p-6">
                        <div className="flex items-center space-x-4">
                            {collaborator.avatarUrl ? (
                                <Image
                                    src={collaborator.avatarUrl}
                                    alt={`${collaborator.name}'s avatar`}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground text-lg font-medium">
                                        {collaborator.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-foreground">{collaborator.name}</h3>
                                <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                collaborator.status === 'active'
                                    ? 'bg-success/20 text-success'
                                    : 'bg-warning/20 text-warning'
                            }`}>
                                {collaborator.status}
                            </span>
                        </div>
                        <div className="mt-4 flex space-x-3">
                            {collaborator.status === 'active' ? (
                                <>
                                    <button className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50">
                                        Message
                                    </button>
                                    <Remove collaboratorId={collaborator.id} refetch={fetchCollaborators} />
                                </>
                            ) : collaborator.status === 'pending' ? (
                                <>
                                    <Accept collaboratorId={collaborator.id} refetch={fetchCollaborators} />
                                    <Decline collaboratorId={collaborator.id} refetch={fetchCollaborators} />
                                </>
                            ) : collaborator.status === 'offered' ? (
                                <>
                                    <WithdrawOffer collaboratorId={collaborator.id} refetch={fetchCollaborators} />
                                    <CancelOffer collaboratorId={collaborator.id} refetch={fetchCollaborators} />
                                </>
                            ) : collaborator.status === 'accepted' ? (
                                <>
                                    <SendOffer collaboratorId={collaborator.id} refetch={fetchCollaborators} />
                                </>
                            ) : collaborator.status === 'declined' || collaborator.status === 'cancelled' || collaborator.status === 'withdrawn' ? (
                                <>
                                    <Remove collaboratorId={collaborator.id} refetch={fetchCollaborators} />
                                </>
                            ) : null}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}