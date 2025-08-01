#include <Arduino.h>

unsigned long lastKeyStroke = 0;
const int LEDS = 3;
constexpr int LED_PIN_INDEX[LEDS] = {2, 3, 4};
unsigned long LED_LAST_ON[LEDS] = {0,0,0};

void setup() {
    Serial.begin(9600);
    Serial.println("Ready for input:");
    for (const int i : LED_PIN_INDEX) {
        pinMode(i,OUTPUT);
    }
}

bool process_serial_input() {
    if (Serial.available()) {
        String input = Serial.readStringUntil('\n');
        int number = input.toInt();
        Serial.println(number);
        if (number > LEDS) {
            return true;
        }
        LED_LAST_ON[number-1] = millis();
    }
    return false;
}

void loop() {
    if (process_serial_input()) return;
    for (int i = 0; i < LEDS; i++) {
        if (millis() - LED_LAST_ON[i] > 10) {
            digitalWrite(LED_PIN_INDEX[i],LOW);
        } else {
            digitalWrite(LED_PIN_INDEX[i],HIGH);
        }
    }
}
