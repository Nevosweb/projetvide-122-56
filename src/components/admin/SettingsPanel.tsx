
import { TableTypesManager } from "./TableTypesManager";
import { MenuPriceManager } from "./MenuPriceManager";
import { Separator } from "@/components/ui/separator";

export const SettingsPanel = () => {
  return (
    <div className="space-y-8">
      <TableTypesManager />
      <Separator className="my-8" />
      <MenuPriceManager />
    </div>
  );
};
