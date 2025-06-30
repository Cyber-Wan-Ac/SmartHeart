#include <WiFi.h>
#include <Firebase_ESP_Client.h> // gunakan nama file library terbaru

// Konfigurasi WiFi
#define WIFI_SSID "NAMA_WIFI"
#define WIFI_PASSWORD "PASSWORD_WIFI"

// URL Firebase dan API key (jika perlu)
#define DATABASE_URL "https://smart-heart-sensors-default-rtdb.asia-southeast1.firebasedatabase.app/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  config.database_url = DATABASE_URL;
  config.signer.test_mode = true;  // Kalau pakai mode testing

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  int bpm = random(65, 100);  // Ganti dengan sensor asli
  if (Firebase.RTDB.setInt(&fbdo, "/patients/P001/bpm", bpm)) {
    Serial.println("BPM dikirim");
  } else {
    Serial.println(fbdo.errorReason());
  }

  Firebase.RTDB.pushInt(&fbdo, "/patients/P001/bpm_history", bpm);
  delay(1000);
}
