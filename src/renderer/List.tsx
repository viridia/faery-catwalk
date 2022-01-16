import clsx from 'clsx';
import { listClass, listHeaderClass, listItemClass } from './List.css';

interface ListItem<T> {
  name: string;
  value: T;
}

interface Props<T> {
  title: string;
  items: ListItem<T>[];
  selected: T;
  onChange: (selected: T) => void;
}

export function List<T = string>({ title, items, selected, onChange }: Props<T>) {
  return (
    <section className={listClass}>
      <header className={listHeaderClass}>{title}</header>
      {items
        .map(child => (
          <div
            key={`${child.value}`}
            className={clsx(listItemClass, { selected: child.value === selected })}
            onClick={e => {
              e.preventDefault();
              onChange(child.value);
            }}
          >
            {child.name}
          </div>
        ))}
    </section>
  );
};
