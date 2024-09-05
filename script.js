function fetchDataWithThen() {
    return fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
            return data;
        })
        .catch(error => console.error('Error fetching data:', error));
}

function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    data.forEach(coin => {
        const row = document.createElement('tr');
        let col = coin.price_change_percentage_24h.toFixed(2) > 0 ? "green" : "red";
        row.innerHTML = `
            <td><img src="${coin.image}" alt="${coin.name} logo">${coin.name}</td> 
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price}</td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td style="color: ${col}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>Mkt Cap: ${coin.market_cap.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch data on load
fetchDataWithThen();

// Fetching data using async/await
fetchDataAsync();
async function fetchDataAsync() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Search functionality
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    fetchDataWithThen().then(data => {
        const filteredData = data.filter(coin =>
            coin.name.toLowerCase().includes(query) ||
            coin.symbol.toLowerCase().includes(query)
        );
        renderTable(filteredData);
    });
});

// Sort functionality
document.getElementById('sortbymkt').addEventListener('click', () => {
    fetchDataWithThen().then(data => {
        const sortedData = data.sort((a, b) => b.market_cap - a.market_cap);
        renderTable(sortedData);
    });
});

document.getElementById('sortbyper').addEventListener('click', () => {
    fetchDataWithThen().then(data => {
        const sortedData = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderTable(sortedData);
    });
});