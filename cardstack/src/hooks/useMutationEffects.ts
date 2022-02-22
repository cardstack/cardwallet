import { useEffect } from 'react';

type EffectParams = {
  status: boolean;
  callback: () => void;
};

type MutationStatus = 'loading' | 'success' | 'error';

type useMutationEffectsParams = Partial<Record<MutationStatus, EffectParams>>;

export const useMutationEffects = ({
  loading,
  success,
  error,
}: useMutationEffectsParams) => {
  useEffect(() => {
    if (loading?.status) {
      loading?.callback();
    }
  }, [loading]);

  useEffect(() => {
    if (success?.status) {
      success?.callback();
    }
  }, [success]);

  useEffect(() => {
    if (error?.status) {
      error?.callback();
    }
  }, [error]);
};
