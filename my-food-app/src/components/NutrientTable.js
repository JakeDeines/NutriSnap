import React from 'react';
import './NutrientTable.css';

function NutrientTable({ data }) {
  return (
    <div className="table-container">
      <div className="nutrient-table-card">

        {/* Desktop Table (visible on larger screens) */}
        <table className="desktop-table">
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

        {/* Mobile Cards (hidden on larger screens) */}
        <div className="mobile-nutrient-cards">
          {data.map((item, index) => (
            <div key={index} className="mobile-nutrient-card">
              <p><strong>Nutrient:</strong> {item.nutrient}</p>
              <p><strong>Amount:</strong> {item.amount}</p>
              <p><strong>% Daily Value:</strong> {item.dailyValue}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default NutrientTable;
