'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteMemecoin } from '@/lib/memecoin.actions';

interface DeleteMemecoinButtonProps {
  memecoinId: string;
}

export default function DeleteMemecoinButton({ memecoinId }: DeleteMemecoinButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce memecoin ?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMemecoin(memecoinId);
      toast.success('Memecoin supprimé avec succès');
      // Use window.location.href instead of router.push for a full page refresh
      window.location.href = '/memecoins';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete} 
      disabled={isDeleting}
    >
      {isDeleting ? 'Suppression...' : 'Supprimer'}
    </Button>
  );
}
