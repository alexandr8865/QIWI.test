// Получаем все нужные элементы
const selectElement = document.getElementById("currencies__selector");
const loader = document.querySelector(".lds-hourglass");
const card = document.querySelector(".currency__card");
const name = document.querySelector(".name");
const date = document.querySelector(".date");
const previousValue = document.querySelector(".previous__value");

// Динамически обновляем меню выбора
selectElement.addEventListener("change", (event) => {
  card.style.display = "flex";
  const selectedOption = event.target.selectedOptions[0];
  const hiddenData = JSON.parse(selectedOption.getAttribute("data-hidden"));
  name.textContent = `${hiddenData.currency["ID"]} - ${hiddenData.currency["Name"]} (${hiddenData.currency["CharCode"]})`;
  date.textContent = `${hiddenData.date} - ${hiddenData.currency["Previous"]}`;
});

// Получаем данные и отрисовываем меню выбора
const fetchData = async () => {
  try {
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
    if (!response.ok) {
      throw new Error("Error is not ok!");
    }
    const data = await response.json();
    Object.values(data.Valute).map((currency) => {
      const currencyElement = document.createElement("option");
      currencyElement.textContent = `${currency["ID"]} - ${currency["Name"]}`;
      currencyElement.setAttribute(
        "data-hidden",
        JSON.stringify({
          currency: currency,
          date: formatDate(data.Date),
        })
      );
      selectElement.appendChild(currencyElement);
    });
    loader.style.display = "none";
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

// Функция форматирования даты
const formatDate = (date) => {
  const dateObj = new Date(date);

  function addLeadingZero(number) {
    return number < 10 ? `0${number}` : number;
  }

  const year = dateObj.getFullYear();
  const month = addLeadingZero(dateObj.getMonth() + 1);
  const day = addLeadingZero(dateObj.getDate());
  const hours = addLeadingZero(dateObj.getHours());
  const minutes = addLeadingZero(dateObj.getMinutes());
  const seconds = addLeadingZero(dateObj.getSeconds());

  const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};

fetchData();
