import {
  canFuseEvents,
  getFusionIntensity,
  hasFusionIntensityChanged,
} from "./FusionRules";

import {
  createFusionExpiration,
  defaultFusionConfiguration,
  isFusedEventExpired,
} from "./FusionWindow";

import type {
  FusedEvent,
  FusionConfiguration,
  FusionSourceEvent,
  FusionUpdateResult,
} from "./types";

function createFusedEventId(
  sourceEvent: FusionSourceEvent,
): string {
  return [
    sourceEvent.kind,
    sourceEvent.fusionKey,
    sourceEvent.createdAt,
  ].join(":");
}

function collectSenderIds(
  existingSenderIds: string[],
  senderId: string | null,
): string[] {
  if (
    !senderId ||
    existingSenderIds.includes(senderId)
  ) {
    return existingSenderIds;
  }

  return [
    ...existingSenderIds,
    senderId,
  ];
}

export function createFusedEvent(
  sourceEvent: FusionSourceEvent,
  configuration: FusionConfiguration =
    defaultFusionConfiguration,
  currentTime = Date.now(),
): FusedEvent {
  return {
    id:
      createFusedEventId(
        sourceEvent,
      ),
    fusionKey:
      sourceEvent.fusionKey,
    kind:
      sourceEvent.kind,
    sourceEventIds: [
      sourceEvent.id,
    ],
    senderIds:
      sourceEvent.senderId
        ? [sourceEvent.senderId]
        : [],
    count: 1,
    totalAmount:
      Math.max(
        sourceEvent.amount,
        0,
      ),
    totalEnergy:
      Math.max(
        sourceEvent.energy,
        0,
      ),
    intensity: "low",
    startedAt:
      currentTime,
    updatedAt:
      currentTime,
    expiresAt:
      createFusionExpiration(
        currentTime,
        configuration.windowMs,
      ),
    payloads: [
      sourceEvent.payload,
    ],
  };
}

export function updateFusedEvent(
  currentFusedEvent: FusedEvent | null,
  sourceEvent: FusionSourceEvent,
  configuration: FusionConfiguration =
    defaultFusionConfiguration,
  currentTime = Date.now(),
): FusionUpdateResult {
  const shouldCreateNewEvent =
    !currentFusedEvent ||
    !canFuseEvents(
      currentFusedEvent.fusionKey,
      sourceEvent.fusionKey,
    ) ||
    currentFusedEvent.kind !==
      sourceEvent.kind ||
    isFusedEventExpired(
      currentFusedEvent,
      currentTime,
    );

  if (shouldCreateNewEvent) {
    return {
      fusedEvent:
        createFusedEvent(
          sourceEvent,
          configuration,
          currentTime,
        ),
      created: true,
      upgraded: false,
    };
  }

  if (
    currentFusedEvent.sourceEventIds.includes(
      sourceEvent.id,
    )
  ) {
    return {
      fusedEvent:
        currentFusedEvent,
      created: false,
      upgraded: false,
    };
  }

  const nextCount = Math.min(
    currentFusedEvent.count + 1,
    configuration.maximumEvents,
  );

  return {
    fusedEvent: {
      ...currentFusedEvent,
      sourceEventIds: [
        ...currentFusedEvent
          .sourceEventIds,
        sourceEvent.id,
      ],
      senderIds:
        collectSenderIds(
          currentFusedEvent.senderIds,
          sourceEvent.senderId,
        ),
      count:
        nextCount,
      totalAmount:
        currentFusedEvent.totalAmount +
        Math.max(
          sourceEvent.amount,
          0,
        ),
      totalEnergy:
        currentFusedEvent.totalEnergy +
        Math.max(
          sourceEvent.energy,
          0,
        ),
      intensity:
        getFusionIntensity(
          nextCount,
        ),
      updatedAt:
        currentTime,
      expiresAt:
        createFusionExpiration(
          currentTime,
          configuration.windowMs,
        ),
      payloads: [
        ...currentFusedEvent.payloads,
        sourceEvent.payload,
      ],
    },
    created: false,
    upgraded:
      hasFusionIntensityChanged(
        currentFusedEvent.count,
        nextCount,
      ),
  };
}
