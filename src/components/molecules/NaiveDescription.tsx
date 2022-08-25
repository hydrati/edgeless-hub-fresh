import React, {useEffect, useState} from 'react';

interface Prop {
  kvMap: Record<string, string | React.ReactNode>;
  keyWidth: string;
  rowHeight: string;
  addColon?: boolean;
}

export const NaiveDescription = ({kvMap, keyWidth, rowHeight, addColon}: Prop) => {
  const [reactiveItems, setReactiveItems] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    let elements: React.ReactNode[] = [];
    let tdCount = 0;
    for (let key in kvMap) {
      const content = kvMap[key];
      elements.push(
        <tr key={key}>
          <td width={keyWidth} height={rowHeight} key={key}>
            {key}
            {addColon && '：'}
          </td>
          <td key={tdCount++}>
            {content}
          </td>
        </tr>,
      );
    }
    setReactiveItems(elements);
  }, [kvMap]);
  return (
    <table style={{margin: "auto"}}>
      <tbody>{reactiveItems}</tbody>
    </table>
  );
};
