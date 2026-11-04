```json
{
  "status": "success",
  "message": "string",
  "data": {
    "contract": {
      "publicationStatus": "not_finalized",
      "publication": {
        "id": 0,
        "timezone": "string",
        "finalizedAt": "2026-11-04T00:05:13.264Z"
      },
      "inventoryRules": {
        "mode": "shared_pool",
        "roomsPerNight": 2147483647,
        "roomCaps": [
          {
            "roomId": 2147483647,
            "view": "sea",
            "variationId": 0,
            "maxRoomsPerNight": 2147483647
          }
        ],
        "rooms": [
          {
            "roomId": 2147483647,
            "view": "sea",
            "variationId": 0,
            "roomsPerNight": 2147483647,
            "overbookingLimitPerNight": 2147483647
          }
        ],
        "whenSoldOut": {
          "action": "stop_sale",
          "overbookingLimitPerNight": 2147483647
        }
      },
      "inventoryStatus": "not_configured",
      "inventoryIssues": [
        {
          "path": "string",
          "code": "overbooking_limit_required",
          "message": "string"
        }
      ],
      "id": 0,
      "supplierId": 0,
      "hotelId": 0,
      "name": "string",
      "startDate": "2026-11-04",
      "endDate": "2026-11-04",
      "currency": "EGP",
      "bookingType": "allotment_block",
      "onRequestSettings": {
        "slaMinutes": 30,
        "expiryAction": "auto_reject"
      },
      "pricingModel": "base_plus_supplements",
      "status": "draft",
      "weekPricing": null,
      "releasePolicy": {
        "type": "same_day",
        "daysBeforeCheckIn": 0,
        "releaseTime": "18:00",
        "afterReleaseAction": "stop_sale"
      },
      "bookingCutoff": {
        "daysBeforeCheckIn": 0,
        "cutoffTime": "14:00"
      },
      "pricing": {
        "weekPricing": {
          "mode": "same_all_week",
          "weekendDays": [
            "friday",
            "saturday"
          ]
        },
        "baseRoom": {
          "roomId": 2147483647,
          "view": "sea",
          "variationId": 0,
          "rate": {
            "amount": 10000000,
            "weekday": 10000000,
            "weekend": 10000000
          },
          "supplement": 0,
          "legacySupplement": {
            "amount": 10000000,
            "weekday": 10000000,
            "weekend": 10000000
          },
          "mealPlans": [
            {
              "type": "bed_and_breakfast",
              "pricingBasis": "per_person",
              "price": 10000000
            }
          ]
        },
        "rooms": [
          {
            "roomId": 2147483647,
            "view": "sea",
            "variationId": 0,
            "rate": {
              "amount": 10000000,
              "weekday": 10000000,
              "weekend": 10000000
            },
            "supplement": 0,
            "legacySupplement": {
              "amount": 10000000,
              "weekday": 10000000,
              "weekend": 10000000
            },
            "mealPlans": [
              {
                "type": "bed_and_breakfast",
                "pricingBasis": "per_person",
                "price": 10000000
              }
            ]
          }
        ],
        "mealPlans": [
          {
            "type": "bed_and_breakfast",
            "pricingBasis": "per_person",
            "price": 10000000
          }
        ]
      },
      "pricingStatus": "not_configured",
      "pricingIssues": [
        {
          "path": "string",
          "code": "meal_price_missing",
          "message": "string"
        }
      ],
      "resolvedRoomPrices": [
        {
          "variationId": 0,
          "view": "string",
          "mealPlans": [
            {
              "type": "bed_and_breakfast",
              "pricingBasis": "per_person",
              "price": 10000000
            }
          ],
          "roomId": 0,
          "price": {
            "amount": 10000000,
            "weekday": 10000000,
            "weekend": 10000000
          }
        }
      ],
      "childPricing": {
        "sharing_parents": {
          "from": 6,
          "to": 11,
          "price": 50
        },
        "shared_bed": {
          "from": 6,
          "to": 11,
          "price": 50
        },
        "extra_bed": {
          "from": 6,
          "to": 11,
          "price": 50
        }
      },
      "restrictions": [
        {
          "id": 0,
          "contractId": 0,
          "roomId": 0,
          "appliesFrom": "2026-11-04",
          "appliesTo": "2026-11-04",
          "minNights": 0,
          "appliesOn": "every_day",
          "restrictedCheckinDays": [
            0
          ],
          "restrictedCheckoutDays": [
            0
          ],
          "isActive": true,
          "createdBySupplierUserId": 0,
          "updatedBySupplierUserId": 0,
          "createdAt": "2026-11-04T00:05:13.264Z",
          "updatedAt": "2026-11-04T00:05:13.264Z"
        }
      ],
      "seasons": [
        {
          "id": 0,
          "contractId": 0,
          "name": "string",
          "startDate": "2026-11-04",
          "endDate": "2026-11-04",
          "nights": 0,
          "color": "#E4572E",
          "issues": [
            {
              "code": "outside_contract_period",
              "message": "string"
            }
          ],
          "pricing": {
            "baseRate": {
              "amount": 10000000,
              "weekday": 10000000,
              "weekend": 10000000
            },
            "rooms": [
              {
                "roomId": 2147483647,
                "view": "sea",
                "rate": {
                  "amount": 10000000,
                  "weekday": 10000000,
                  "weekend": 10000000
                },
                "supplement": 0,
                "legacySupplement": {
                  "amount": 10000000,
                  "weekday": 10000000,
                  "weekend": 10000000
                },
                "mealPlans": [
                  {
                    "type": "bed_and_breakfast",
                    "price": 10000000
                  }
                ]
              }
            ],
            "mealPlans": [
              {
                "type": "bed_and_breakfast",
                "price": 10000000
              }
            ],
            "childPrices": {
              "sharing_parents": 0,
              "shared_bed": 0,
              "extra_bed": 0
            }
          },
          "resolvedRoomPrices": [
            {
              "variationId": 0,
              "view": "string",
              "mealPlans": [
                {
                  "type": "bed_and_breakfast",
                  "pricingBasis": "per_person",
                  "price": 10000000
                }
              ],
              "roomId": 0,
              "price": {
                "amount": 10000000,
                "weekday": 10000000,
                "weekend": 10000000
              }
            }
          ],
          "resolvedChildPricing": {
            "sharing_parents": {
              "from": 6,
              "to": 11,
              "price": 50
            },
            "shared_bed": {
              "from": 6,
              "to": 11,
              "price": 50
            },
            "extra_bed": {
              "from": 6,
              "to": 11,
              "price": 50
            }
          },
          "cancellationPolicy": {
            "tiers": [
              {
                "daysBefore": 0,
                "charge": {
                  "kind": "free",
                  "value": 0
                }
              }
            ],
            "noShow": {
              "kind": "free",
              "value": 0
            }
          },
          "effectiveCancellationPolicy": {
            "tiers": [
              {
                "daysBefore": 0,
                "charge": {
                  "kind": "free",
                  "value": 0
                }
              }
            ],
            "noShow": {
              "kind": "free",
              "value": 0
            }
          },
          "cancellationPolicySource": "season",
          "createdBySupplierUserId": 0,
          "updatedBySupplierUserId": 0,
          "createdAt": "2026-11-04T00:05:13.265Z",
          "updatedAt": "2026-11-04T00:05:13.265Z"
        }
      ],
      "cancellationPolicy": {
        "tiers": [
          {
            "daysBefore": 0,
            "charge": {
              "kind": "free",
              "value": 0
            }
          }
        ],
        "noShow": {
          "kind": "free",
          "value": 0
        }
      },
      "createdBySupplierUserId": 0,
      "updatedBySupplierUserId": 0,
      "createdAt": "2026-11-04T00:05:13.265Z",
      "updatedAt": "2026-11-04T00:05:13.265Z",
      "version": 1
    },
    "contractId": 0,
    "version": 0,
    "evaluatedAt": "2026-11-04T00:05:13.265Z",
    "businessDate": "2026-11-04",
    "timezone": "string",
    "targetStatus": "active",
    "canFinalize": true,
    "issues": [
      {
        "code": "string",
        "severity": "error",
        "section": "string",
        "path": "string",
        "message": "string",
        "entityId": 0
      }
    ],
    "inventoryPreview": {
      "startDate": "2026-11-04",
      "endDate": "2026-11-04",
      "nights": 0,
      "mode": "string",
      "poolCount": 0,
      "poolNights": 0,
      "capNights": 0,
      "estimatedRecords": 0,
      "rules": {
        "mode": "shared_pool",
        "roomsPerNight": 2147483647,
        "roomCaps": [
          {
            "roomId": 2147483647,
            "view": "sea",
            "variationId": 0,
            "maxRoomsPerNight": 2147483647
          }
        ],
        "rooms": [
          {
            "roomId": 2147483647,
            "view": "sea",
            "variationId": 0,
            "roomsPerNight": 2147483647,
            "overbookingLimitPerNight": 2147483647
          }
        ],
        "whenSoldOut": {
          "action": "stop_sale",
          "overbookingLimitPerNight": 2147483647
        }
      }
    },
    "confirmation": {
      "version": "contract-finalization-v1",
      "text": "I confirm these rates, stock and rules on behalf of my supplier company. Confirmed bookings under this contract are contractually binding."
    }
  }
}
```