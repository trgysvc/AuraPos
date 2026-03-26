Okay, I need to create an offline banner and sync UI components for the AuraPOS project using React/Next.js with TypeScript. Let me break down the requirements and figure out how to approach this.

First, the offline banner should display when the app is offline. I'll need to use the navigator.onLine property to detect the online status. Since this is a React component, I can use a state variable to track the online status and update it whenever the connection changes.

Next, the sync status indicator should show the last sync time and whether it's currently syncing. I'll create a state for the last sync time and a syncing boolean. To simulate sync, I'll add a button that triggers a function updating the last sync time and showing a syncing state for a few seconds.

For styling, I'll use Tailwind CSS as per the guidelines. The offline banner should have a red background with white text, and the sync status should be a small indicator, maybe green when synced and gray when syncing or not synced.

I also need to handle localization. The text should come from a JSON file using the \n character for line breaks, and apply the whitespace-pre-line class in the banner to display them correctly.

I'll structure the components: a SyncStatusIndicator for the top-right corner showing the last sync and a syncing animation. The OfflineBanner will be conditionally rendered only when offline.

In the main component, I'll use useEffect to check the online status and update it. I'll also add an event listener for online/offline changes to update the state accordingly.

Finally, I'll make sure all imports are correct and the component is exported properly. I'll test the component to ensure it works both online and offline, showing the correct banners and sync statuses.
</think>

```typescript
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const SyncStatusIndicator = ({ lastSync, isSyncing }: { lastSync: Date, isSyncing: boolean }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span className={`animate-pulse ${isSyncing ? 'text-green-500' : 'text-gray-400'}`}>
        {isSyncing ? t('syncing') : t('last_synced')}
      </span>
      <span className="font-medium">
        {isSyncing ? t('syncing_now') : 
          new Date(lastSync).toLocaleString()}
      </span>
    </div>
  );
};

const OfflineBanner = ({ isOnline }: { isOnline: boolean }) => {
  const { t } = useTranslation('common');
  
  if (isOnline) return null;

  return (
    <div className="w-full bg-red-500 text-white py-2 px-4 fixed top-0 left-0 z-50">
      <p className="whitespace-pre-line">
        {t('offline_banner', {
          newline: '\n'
        })}
      </p>
    </div>
  );
};

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const triggerSync = () => {
    setIsSyncing(true);
    setLastSync(new Date());
    setTimeout(() => setIsSyncing(false), 3000);
  };

  return (
    <div className="relative h-screen">
      <button 
        onClick={triggerSync}
        className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
      >
        <SyncStatusIndicator 
          lastSync={lastSync}
          isSyncing={isSyncing}
        />
      </button>
      <OfflineBanner isOnline={isOnline} />
    </div>
  );
};
```