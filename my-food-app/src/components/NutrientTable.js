import React from 'react';

function NutrientTable({ data }) {
  // Assuming data is an array of objects with 'nutrient', 'amount', and 'dailyValue' properties
  return (
    <table>
      <thead>
        <tr>
          <th>Nutrient</th>
          <th>Amount per Serving</th>
          <th>% Daily Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.nutrient}</td>
            <td>{item.amount}</td>
            <td>{item.dailyValue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default NutrientTable;
