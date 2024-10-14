import {
  ShieldIcon,
  ZapIcon,
  GlobeIcon,
  SettingsIcon,
  LockIcon,
  AppWindowIcon
} from "lucide-react";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function Features() {
  return (
    <>
      <section className="rounded bg-gradient-to-r py-6 shadow-md dark:from-gray-800 dark:to-indigo-900 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon={GlobeIcon}
                title="Browser Based"
                description="No installation required. Access and analyze your SQLite databases directly in your web browser."
              />
              <Feature
                icon={ZapIcon}
                title="Lightning Fast"
                description="Powered by WebAssembly (WASM) for near-native performance, even with large databases."
              />
              <Feature
                icon={ShieldIcon}
                title="100% Secure"
                description="Your data never leaves your device. All processing happens client-side, ensuring complete privacy."
              />
              <Feature
                icon={SettingsIcon}
                title="Customizable Interface"
                description="Different themes and settings. Adjust the look and feel of your interface to suit your preferences and workflow."
              />
              <Feature
                icon={LockIcon}
                title="Offline Capable"
                description="Work on your databases without an internet connection. Perfect for sensitive data or remote work."
              />
              <Feature
                icon={AppWindowIcon}
                title="PWA Support"
                description="Install the app on your desktop or mobile device for a genuine native experience. Enjoy robust offline functionality."
              />
            </div>
          </div>
        </div>
      </section>
      <div className="pb-[72px] md:pb-0" />
    </>
  );
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <div>
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}
