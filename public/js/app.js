let personInfo = {};

let delay = 5000;
const timerId = setInterval(async () => {
  // Таймер на 5с
  const response = await fetch('http://tt.centr-to.ru/frontend-2023.txt');
  //   const response = await fetch('http://localhost:3000/list.txt');
  if (response.ok) {
    const text = await response.text();
    const result = text.split('\n').filter((element) => element.trim() !== '');
    // console.log(result);
    result.forEach((item) => {
      let [name, number] = item.split(' ');
      if (!(name.length && number.length)) return; // Проверяем все ли параметры пришли
      if (!personInfo[name]) {
        // Первая инициализация пользователя
        personInfo[name] = {
          number: [number],
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        };
      } else {
        // Если пользователь уже был то добавляем данные под его имя
        personInfo[name].number.push(number);
      }
    });
    // console.log('personInfo', personInfo);
  } else {
    alert('Ошибка HTTP: ' + response.status);
    clearInterval(timerId);
  }
}, 5000);

const dataTimerId = setInterval(() => {
  // Таймер на 10мин
  graph(document.getElementById('graph'), personInfo, (init = false));
}, 10000); // Для теста стоит 10с

const WIDTH = 600;
const HEIGHT = 100;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT;
const STEP_X = 100;

function graph(canvas, data, init = true) {
  const ctx = canvas.getContext('2d');
  if (init) {
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Отчищаем холст перед новым построением графика

  if (data) {
    document.querySelector('.person').innerHTML = ''; // Отчищаем легенду
    const listPerson = [];
    for (const person in data) {
      const personItem = document.createElement('div');
      personItem.className = 'person__item';
      personItem.innerHTML = `
              <div class="person__name">${person}</div>
              <div class="person__color" style="background-color: ${data[person].color}"></div>
            `;
      listPerson.push(personItem);

      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = data[person].color;

      let number = data[person].number;
      for (let i = 0; i < number.length; i++) {
        let y = number[i];
        y = parseFloat(y);
        ctx.lineTo((DPI_WIDTH / number.length) * i, DPI_HEIGHT - y);
      }

      ctx.stroke();
      ctx.closePath();
    }

    listPerson.forEach((item) => {
      // Создаем легенду
      document.querySelector('.person').append(item);
    });
  }
}

graph(document.getElementById('graph'));
