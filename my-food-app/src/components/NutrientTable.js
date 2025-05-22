import React from 'react';
import './NutrientTable.css';

function NutrientTable({ data }) {
  return (
    <div className="table-container">
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
              <td data-label="Nutrient">{item.nutrient}</td>
              <td data-label="Amount per Serving">{item.amount}</td>
              <td data-label="% Daily Value">{item.dailyValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NutrientTable;
