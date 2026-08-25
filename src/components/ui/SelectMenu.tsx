import React from "react";
import Select from "react-select";
import type {
  SingleValue,
  MultiValue,
  StylesConfig,
  GroupBase,
  OptionProps,
  ControlProps
} from "react-select";
import { useTranslation } from "react-i18next";

export interface OptionType {
  label: string;
  value: string | number;
}

interface SelectMenuProps {
  options?: OptionType[];
  value?: OptionType | OptionType[] | null;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  isSearchable?: boolean;
  name?: string;
  placeholder?: string;
  onChange: (value: string | number | (string | number)[] | null) => void;
  error?: boolean;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  selectAll?: boolean;
  CustomOption?: React.ComponentType<OptionProps<OptionType, boolean, GroupBase<OptionType>>>;
  Control?: React.ComponentType<ControlProps<OptionType, boolean, GroupBase<OptionType>>>;
  defaultInputValue?: string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  options = [],
  value,
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isMulti = false,
  isSearchable = true,
  name,
  placeholder,
  onChange: setSelected,
  error,
  onBlur,
  selectAll = false,
  CustomOption,
  Control,
  defaultInputValue,
}) => {
  const { t } = useTranslation();
  const selectAllOption = selectAll ? [{ value: "*", label: t("ui.selectAll") }] : [];
  const enhancedOptions = [...selectAllOption, ...options];

  const handleChange = (
    selected: SingleValue<OptionType> | MultiValue<OptionType>
  ) => {
    if (isMulti) {
      const selectedArray = selected as MultiValue<OptionType>;
      const isSelectAll = selectedArray.some((opt) => opt.value === "*");
      if (isSelectAll) {
        const isAllSelected = selectedArray.length === enhancedOptions.length;
        setSelected(isAllSelected ? [] : options.map((opt) => opt.value));
      } else {
        setSelected(selectedArray.map((opt) => opt.value));
      }
    } else {
      const selectedSingle = selected as SingleValue<OptionType>;
      setSelected(selectedSingle?.value || null);
    }
  };

  const customStyles: StylesConfig<OptionType, boolean> = {
    control: (base) => ({
      ...base,
      boxShadow: "none",
      borderRadius: "5px",
      borderColor: error ? "#f44336" : "#ced4da",
      padding: "0 0 0 14px",
      height: "45px",
      fontSize: "0.845rem",
      backgroundColor: "transparent",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#0072bb",
      borderRadius: "4px",
      padding: "2px 6px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#fff",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#fff",
      ":hover": {
        backgroundColor: "#0072bb",
      },
    }),
  };

  return (
    <div>
      <Select<OptionType, boolean>
        defaultInputValue={defaultInputValue}
        aria-labelledby={name}
        noOptionsMessage={() => t("ui.noOptions")}
        styles={customStyles}
        classNamePrefix="custom-select"
        value={value}
        isDisabled={isDisabled || isLoading}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isMulti={isMulti}
        name={name}
        id={name}
        options={enhancedOptions}
        hideSelectedOptions={isMulti}
        closeMenuOnSelect={!isMulti}
        placeholder={placeholder || t("ui.selectPlaceholder")}
        onChange={handleChange}
        onBlur={onBlur}
        menuPosition="fixed"
        components={{
          ...(CustomOption && { Option: CustomOption }),
          ...(Control && { Control }),
        }}
      />
      {/* {error && <p className="text-red-500 text-sm">{}</p>} */}
    </div>
  );
};

export default SelectMenu;
