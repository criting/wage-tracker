<script setup lang="ts">
import NumberFlow from '@number-flow/vue';
import { ref, computed, onMounted, watch } from 'vue';

const startTime = useLocalStorage('startTime', '09:00');
const endTime = useLocalStorage('endTime', '17:00');
const hourlyWageString = useLocalStorage('hourlyWage', '50');
const hourlyWage = computed({
  get: () => Number(hourlyWageString.value),
  set: (val: number) => {
    hourlyWageString.value = String(val);
  }
});
const currency = useLocalStorage('currency', 'USD');

const supportedCurrencies = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'AUD',
  'CAD',
  'BRL',
  'MXN',
  'ARS',
  'CLP',
  'COP',
  'PEN',
  'VES',
  'UYU',
  'PYG',
  'BOB',
  'CHF',
  'BGN',
  'RON',
  'CZK',
  'PLN',
  'HUF',
  'DKK',
  'SEK',
  'NOK',
  'RUB',
  'TRY',
  'ILS',
  'SAR',
  'AED',
  'QAR',
  'KWD',
  'OMR',
  'BHD',
  'EGP',
  'MAD',
  'DZD',
  'TND',
  'ZAR',
  'NGN',
  'KES',
  'GHS',
  'UGX',
  'TZS',
  'INR',
  'PKR',
  'BDT',
  'LKR',
  'NPR',
  'MMK',
  'THB',
  'VND',
  'MYR',
  'SGD',
  'IDR',
  'PHP',
  'HKD',
  'CNY',
  'KRW',
  'NZD',
  'FJD',
  'PGK'
];

const earnings = ref(0);
let interval: ReturnType<typeof setInterval>;

const calculateEarnings = () => {
  const now = new Date();
  const [startHourRaw, startMinuteRaw] = startTime.value.split(':');
  const [endHourRaw, endMinuteRaw] = endTime.value.split(':');

  const startHour = Number(startHourRaw) || 0;
  const startMinute = Number(startMinuteRaw) || 0;
  const endHour = Number(endHourRaw) || 0;
  const endMinute = Number(endMinuteRaw) || 0;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let start = new Date(today);
  start.setHours(startHour, startMinute, 0, 0);

  let end = new Date(today);
  end.setHours(endHour, endMinute, 0, 0);

  const overnight = end <= start;

  if (overnight) {
    if (now >= start) {
      const endNextDay = new Date(end);
      endNextDay.setDate(endNextDay.getDate() + 1);

      if (now >= endNextDay) {
        const duration = (endNextDay.getTime() - start.getTime()) / 3600000;
        earnings.value = duration * Number(hourlyWage.value);
      } else {
        const elapsed = (now.getTime() - start.getTime()) / 3600000;
        earnings.value = elapsed * Number(hourlyWage.value);
      }
    } else {
      const startYesterday = new Date(start);
      startYesterday.setDate(startYesterday.getDate() - 1);

      const endToday = new Date(end);

      if (now >= endToday) {
        const duration = (endToday.getTime() - startYesterday.getTime()) / 3600000;
        earnings.value = duration * Number(hourlyWage.value);
      } else {
        const elapsed = (now.getTime() - startYesterday.getTime()) / 3600000;
        earnings.value = elapsed * Number(hourlyWage.value);
      }
    }
  } else {
    // Same day shift
    if (now < start) {
      earnings.value = 0;
    } else if (now >= end) {
      const duration = (end.getTime() - start.getTime()) / 3600000;
      earnings.value = duration * Number(hourlyWage.value);
    } else {
      const elapsed = (now.getTime() - start.getTime()) / 3600000;
      earnings.value = elapsed * Number(hourlyWage.value);
    }
  }
};

const formattedEarnings = computed(() => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.value,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(earnings.value);
});

// Map country to currency fallback
const countryToCurrency: Record<string, string> = {
  US: 'USD',
  CA: 'CAD',
  MX: 'MXN',
  BR: 'BRL',
  AR: 'ARS',
  CL: 'CLP',
  CO: 'COP',
  PE: 'PEN',
  VE: 'VES',
  UY: 'UYU',
  PY: 'PYG',
  BO: 'BOB',
  EC: 'USD',
  GB: 'GBP',
  IE: 'EUR',
  FR: 'EUR',
  DE: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  PT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  LU: 'EUR',
  AT: 'EUR',
  FI: 'EUR',
  EE: 'EUR',
  LV: 'EUR',
  LT: 'EUR',
  SK: 'EUR',
  SI: 'EUR',
  GR: 'EUR',
  CY: 'EUR',
  MT: 'EUR',
  HR: 'EUR',
  BG: 'BGN',
  RO: 'RON',
  CZ: 'CZK',
  PL: 'PLN',
  HU: 'HUF',
  DK: 'DKK',
  SE: 'SEK',
  NO: 'NOK',
  CH: 'CHF',
  RU: 'RUB',
  TR: 'TRY',
  IL: 'ILS',
  SA: 'SAR',
  AE: 'AED',
  QA: 'QAR',
  KW: 'KWD',
  OM: 'OMR',
  BH: 'BHD',
  EG: 'EGP',
  MA: 'MAD',
  DZ: 'DZD',
  TN: 'TND',
  ZA: 'ZAR',
  NG: 'NGN',
  KE: 'KES',
  GH: 'GHS',
  UG: 'UGX',
  TZ: 'TZS',
  IN: 'INR',
  PK: 'PKR',
  BD: 'BDT',
  LK: 'LKR',
  NP: 'NPR',
  MM: 'MMK',
  TH: 'THB',
  VN: 'VND',
  MY: 'MYR',
  SG: 'SGD',
  ID: 'IDR',
  PH: 'PHP',
  HK: 'HKD',
  CN: 'CNY',
  JP: 'JPY',
  KR: 'KRW',
  AU: 'AUD',
  NZ: 'NZD',
  FJ: 'FJD',
  PG: 'PGK'
};

onMounted(() => {
  calculateEarnings();
  interval = setInterval(() => {
    calculateEarnings();
  }, 1000);
});

watch([startTime, endTime, hourlyWage, currency], () => {
  calculateEarnings();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="max-w-3xl mx-auto h-screen flex flex-col justify-center p-12">
    <Lottie name="money" :width="200" height="50" :speed="0.5" />
    <h1 class="text-2xl md:text-7xl font-bold text-center mt-10">Live Income Tracker</h1>
    <UForm
      :state="{ startTime, endTime, hourlyWage, currency }"
      class="space-y-4 sm:flex gap-2 lg:gap-4 mt-12 flex justify-center items-center w-full flex-col sm:flex-row"
    >
      <UFormField label="Start Time" class="w-full sm:w-auto">
        <UInput v-model="startTime" type="time" class="w-full sm:w-auto" />
      </UFormField>

      <UFormField label="End Time" class="sm:w-auto w-full">
        <UInput v-model="endTime" type="time" class="sm:w-auto w-full" />
      </UFormField>

      <UFormField label="Hourly Wage" class="sm:w-32 w-full">
        <UInputNumber v-model="hourlyWage" class="sm:w-auto w-full" />
      </UFormField>

      <UFormField label="Currency" class="sm:w-auto w-full h-full">
        <USelectMenu v-model="currency" :items="supportedCurrencies" class="sm:w-auto w-full" />
      </UFormField>
    </UForm>

    <div class="text-center">
      <p class="text-lg mt-12 md:mt-8">You’ve earned so far today:</p>
      <p class="text-5xl lg:text-7xl font-bold dar:text-white :text-gray-500">
        <ClientOnly>
          <NumberFlow
            :value="earnings"
            :format="{
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }"
          />
        </ClientOnly>
      </p>
      <p class="mt-6 text-sm text-gray-500">
        "Success is the sum of small efforts, repeated day in and day out." – Robert Collier
      </p>
    </div>
  </div>
</template>
