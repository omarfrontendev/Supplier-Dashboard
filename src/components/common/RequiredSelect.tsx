import { useTranslation } from "react-i18next";

interface Props {
  entity?: string;
}

export default function RequiredSelect({ entity = "area" }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {t("regions.noAreaTitle", {
            entity: t(`entities.${entity}`)
          })}
        </h2>
        <p className="text-gray-500">
          {t("regions.noAreaDescription", {
            entity: t(`entities.${entity}`).toLocaleLowerCase(),
            parent: t(`entities.regions`).toLocaleLowerCase(),
          })}
        </p>
      </div>
    </div>
  );
}
