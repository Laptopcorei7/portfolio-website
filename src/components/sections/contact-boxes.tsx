import { platformIcons } from "@/components/ui/icons";
import { contactMethods } from "@/content/site";

/** The bordered "Message me here" panel used on home and contacts. */
export function MessageBox() {
  return (
    <div className="border-line/60 w-fit border p-4">
      <h3 className="text-base font-medium">Message me here</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {contactMethods.map((method) => {
          const Icon = platformIcons[method.platform];
          return (
            <li key={method.platform} className="flex items-center gap-3">
              <Icon className="text-line/70 h-4 w-4 shrink-0" />
              {method.href ? (
                <a
                  href={method.href}
                  className="hover:text-accent text-base transition-colors"
                >
                  {method.label}
                </a>
              ) : (
                <span className="text-base">{method.label}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The "Support me here" panel from the contacts mockup. Rendered only when a
 * value is configured, so it disappears cleanly if you don't want it.
 */
export function SupportBox({ detail }: { detail?: string }) {
  if (!detail) return null;

  return (
    <div className="border-line/60 h-fit w-fit border p-4">
      <h3 className="text-base font-medium">Support me here</h3>
      <p className="mt-2 text-base">{detail}</p>
    </div>
  );
}
