import { diff } from 'deep-object-diff';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { type LogtoSkuResponse } from '@/cloud/types/router';
import SkuName from '@/components/SkuName';
import { comingSoonSkuQuotaKeys } from '@/consts/plan-quotas';
import { type LogtoSkuQuota, type LogtoSkuQuotaEntries } from '@/types/skus';

import PlanQuotaDiffCard from './PlanQuotaDiffCard';
import styles from './index.module.scss';

type Props = {
  readonly currentSku: LogtoSkuResponse;
  readonly targetSku: LogtoSkuResponse;
};

const excludeSkuComingSoonFeatures = (
  quotaDiff: Partial<LogtoSkuQuota>
): Partial<LogtoSkuQuota> => {
  // eslint-disable-next-line no-restricted-syntax
  const entries = Object.entries(quotaDiff) as LogtoSkuQuotaEntries;
  return Object.fromEntries(entries.filter(([key]) => !comingSoonSkuQuotaKeys.includes(key)));
};

function DowngradeConfirmModalContent({ currentSku, targetSku }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });

  const currentSkuQuotaDiff = useMemo(
    () => excludeSkuComingSoonFeatures(diff(targetSku.quota, currentSku.quota)),
    [targetSku.quota, currentSku.quota]
  );

  const targetSkuQuotaDiff = useMemo(
    () => excludeSkuComingSoonFeatures(diff(currentSku.quota, targetSku.quota)),
    [targetSku.quota, currentSku.quota]
  );

  return (
    <div className={styles.container}>
      <div className={styles.description}>
        <Trans
          components={{
            targetName: <SkuName skuId={targetSku.id} />,
            currentName: <SkuName skuId={currentSku.id} />,
          }}
        >
          {t('subscription.downgrade_modal.description')}
        </Trans>
      </div>
      <div className={styles.content}>
        <PlanQuotaDiffCard skuId={currentSku.id} skuQuotaDiff={currentSkuQuotaDiff} />
        <PlanQuotaDiffCard
          isDowngradeTargetPlan
          skuId={targetSku.id}
          skuQuotaDiff={targetSkuQuotaDiff}
        />
      </div>
    </div>
  );
}

export default DowngradeConfirmModalContent;
