import { useState } from 'react';
import classNames from "classnames";

export default function Switch() {
  const [isSelected, setIsSelected] = useState(true);
  return (
    <div
      onClick={() => setIsSelected(!isSelected)}
      className={classNames('flex w-20 h-10 bg-neutral-600 m-10 rounded-full transition-all duration-500', {
      'bg-indigo-500': isSelected,
    })}>
    <span className={classNames('h-10 w-10 bg-white rounded-full  transition-all duration-50 shadow-lg', {
      'ml-10': isSelected,
    })} />
    </div>
  )
}