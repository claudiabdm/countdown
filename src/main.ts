import './styles/styles.scss';

const updateSeconds = updateCountdownTimeElem('seconds');
const updateMinutes = updateCountdownTimeElem('minutes');
const updateHours = updateCountdownTimeElem('hours');
const updateDays = updateCountdownTimeElem('days');
const countdown = getDate(
  new Date(new Date().getFullYear(), 8, 4, 0, 0, 10, 0)
);


// ------------ //
// LOAD         //
// ------------ //

let timer = 0;

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const timerScreenReaderElem = document.querySelector('[role=timer]');
    let { days, hours, minutes, seconds } = {days: 0, hours: 0, minutes: 0, seconds: 0};
    timer = setInterval(() => {
      ({ days, hours, minutes, seconds } = updateCountdown(Date.now()));
      updateSeconds(seconds);
      updateMinutes(minutes);
      updateHours(hours);
      updateDays(days);
      timerScreenReaderElem?.setAttribute('aria-label', `Time left to launch: ${days} days ${hours} hours ${minutes} minutes`);
    }, 1000);
    const updateCountdown = calculateTimeLeft(countdown, timer);
  },
  false
);

// ------------ //
// COUNTDOWN    //
// ------------ //

function updateCountdownTimeElem(id: string) {
  const flipCard: FlipCard = {
    cardElem: document.querySelector(`#${id} .flip-card`),
    topElem: document.querySelector(`#${id} .flip-card__top`),
    bottomElem: document.querySelector(`#${id} .flip-card__bottom`),
  };
  const digitsCard: DigitsCard = {
    topDigitsElem: document.querySelector(`#${id} .countdown__digits--top`),
    bottomDigitsElem: document.querySelector(
      `#${id} .countdown__digits--bottom`
    ),
  };
  let renderedTime = 0;
  return function updateTime(newTime: number) {
    toggleFlipCard(
      { newTime: newTime, oldTime: renderedTime },
      flipCard,
      digitsCard
    );
    renderedTime = newTime;
  };
}

function toggleFlipCard(
  time: Time,
  flipCard: FlipCard,
  digitsCard: DigitsCard
) {
  if (
    flipCard.cardElem == null ||
    flipCard.bottomElem == null ||
    flipCard.topElem == null ||
    digitsCard.topDigitsElem == null ||
    digitsCard.bottomDigitsElem == null
  )
    return;

  if (time.newTime !== time.oldTime) {
    const futureTimeStr = padTwoDigits(time.newTime + 1);
    const newTimeStr = padTwoDigits(time.newTime);

    flipCard.topElem.textContent = futureTimeStr;
    flipCard.bottomElem.textContent = futureTimeStr;
    digitsCard.bottomDigitsElem.textContent = futureTimeStr;
    digitsCard.topDigitsElem.textContent = newTimeStr;

    flipCard.cardElem.classList.add('flip');

    setTimeout(() => {
      if (flipCard.bottomElem && flipCard.topElem) {
        flipCard.topElem.textContent = newTimeStr;
        flipCard.bottomElem.textContent = newTimeStr;
      }
    }, 375);

    setTimeout(() => {
      if (flipCard.cardElem && flipCard.cardElem.nextElementSibling) {
        flipCard.cardElem.nextElementSibling.textContent = newTimeStr;
        flipCard.cardElem.classList.remove('flip');
      }
    }, 900);

    setTimeout(() => {
      if (
        flipCard.topElem &&
        flipCard.bottomElem &&
        digitsCard.bottomDigitsElem
      ) {
        flipCard.topElem.textContent = newTimeStr;
        flipCard.bottomElem.textContent = newTimeStr;
        digitsCard.bottomDigitsElem.textContent = newTimeStr;
      }
    }, 1000);
  }
}

function calculateTimeLeft(
  countdown: Date,
  timer: number
): (timePassed: number) => UnitsOfTime {
  const duration = countdown.getTime();
  return function getTimeLeft(currentTime: number) {
    const timeLeft = duration - currentTime;

    if (timeLeft < 0) clearInterval(timer);

    const days = (timeLeft / (24 * 60 * 60 * 1000)) | 0;
    const hours = (timeLeft / (60 * 60 * 1000)) % 24 | 0;
    const minutes = (timeLeft / (60 * 1000)) % 60 | 0;
    const seconds = (timeLeft / 1000) % 60 | 0;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };
}

// ------------ //
// UTILS        //
// ------------ //

function padTwoDigits(num: number): string {
  return num < 0 ? '00' : num < 10 ? `0${num}` : String(num);
}

function getDate(date: Date): Date {
  const year = new Date().getFullYear();
  if (date.getTime() - Date.now() < 0) {
    return new Date(year + 1, 3, 4, 0, 0, 0, 0);
  } else {
    return date;
  }
}

interface UnitsOfTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Time {
  newTime: number;
  oldTime: number;
}

interface DigitsCard {
  topDigitsElem: Element | null;
  bottomDigitsElem: Element | null;
}

interface FlipCard {
  cardElem: Element | null;
  topElem: Element | null;
  bottomElem: Element | null;
}
