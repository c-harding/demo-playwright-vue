<script lang="ts">
const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const formatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

const second = 1_000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{ datetime: Date }>();

const isoString = computed(() => String(props.datetime));

const relativeTime = ref('');

let timeout: number | undefined = undefined;
onBeforeUnmount(() => clearTimeout(timeout));

const timeUntilExpiry = (datetime: Date, step: number, max = step) => {
  const existingDuration = Date.now() - datetime.getTime();
  if (existingDuration >= max) return 0;
  return Math.ceil((existingDuration + 1) / step) * step - existingDuration;
};

const labelIfValid = (label: string, remainingTime: number): [string, number] | undefined =>
  remainingTime > 0 ? [label, remainingTime] : undefined;

const labelWithValidity = (datetime: Date): [string, number] => {
  const duration = Date.now() - datetime.getTime();

  return (
    labelIfValid('just now', timeUntilExpiry(datetime, minute / 2)) ??
    labelIfValid('less than a minute ago', timeUntilExpiry(datetime, minute)) ??
    labelIfValid(
      relativeFormatter.format(-Math.floor(duration / minute), 'minutes'),
      timeUntilExpiry(datetime, minute, hour),
    ) ??
    labelIfValid(
      relativeFormatter.format(-Math.floor(duration / hour), 'hours'),
      timeUntilExpiry(datetime, hour, day),
    ) ?? [formatter.format(datetime), Infinity]
  );
};

watch(
  () => props.datetime,
  function updateTimeString() {
    const [label, remainingTime] = labelWithValidity(props.datetime);
    relativeTime.value = label;
    if (isFinite(remainingTime)) {
      clearTimeout(timeout);
      timeout = setTimeout(updateTimeString, remainingTime);
    }
  },
  { immediate: true },
);
</script>

<template>
  <time :datetime="isoString">{{ relativeTime }}</time>
</template>
