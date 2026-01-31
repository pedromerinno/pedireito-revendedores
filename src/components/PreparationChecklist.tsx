import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const checklistItems = [
  "Salve esta página nos favoritos",
  "Coloque um alarme para segunda às 8h55",
  "Esteja nesse site 5 minutos antes do lançamento para clicar no link de abertura",
  "Tenha seus dados de pagamento prontos",
];

export function PreparationChecklist() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(checklistItems.length).fill(false)
  );

  const toggleItem = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-12" aria-labelledby="checklist-heading">
      <div className="text-center">
        <h2
          id="checklist-heading"
          className="inline-block text-lg font-semibold text-[#2B9402] px-4 py-2 rounded-2xl bg-[#FFF2C9] w-fit mb-10 sm:mb-12"
        >
          O que fazer agora:
        </h2>
      </div>
      <ul className="space-y-3">
        {checklistItems.map((item, index) => (
          <li key={index}>
            <label
              htmlFor={`item-${index}`}
              className={`flex items-center gap-4 bg-[#207300] rounded-2xl p-4 sm:p-5 min-h-[72px] sm:min-h-[80px] cursor-pointer transition-opacity hover:opacity-95 ${
                checkedItems[index] ? "opacity-80" : ""
              }`}
            >
              <Checkbox
                id={`item-${index}`}
                checked={checkedItems[index]}
                onCheckedChange={() => toggleItem(index)}
                className="flex-shrink-0 border-2 border-secondary bg-transparent data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=checked]:text-[#207300]"
              />
              <span
                className={`text-base text-white leading-snug ${
                  checkedItems[index] ? "line-through opacity-90" : ""
                }`}
              >
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
