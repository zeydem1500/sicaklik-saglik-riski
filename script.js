
"use strict";

// 1. HTML elemanlarini bul
const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const temperatureInput = document.getElementById("temperature");
const humidityInput = document.getElementById("humidity");
const pm25Input = document.getElementById("pm25");

const errorMessage = document.getElementById("error-message");
const resultStatus = document.getElementById("result-status");
const resultDescription = document.getElementById("result-description");
const riskIndicator = document.getElementById("risk-indicator");
const dataSource = document.getElementById("data-source");

// 2. Risk seviyelerini tanimla
const RISK_LEVELS = [
  {
    name: "Düşük",
    color: "#e5f5e9",
    textColor: "#185c37"
  },
  {
    name: "Orta",
    color: "#fff4cc",
    textColor: "#704d00"
  },
  {
    name: "Yüksek",
    color: "#ffe5cc",
    textColor: "#873b00"
  },
  {
    name: "Çok yüksek",
    color: "#fde2e2",
    textColor: "#9b1c1c"
  }
];

// 3. Girilen verileri kontrol et
function validateData(city, temperature, humidity, pm25) {
  if (!city.trim()) {
    return "Lütfen şehir adını girin.";
  }

  if (city.length > 60) {
    return "Şehir adı en fazla 60 karakter olabilir.";
  }

  if (
    temperature === "" ||
    !Number.isFinite(Number(temperature)) ||
    Number(temperature) < -50 ||
    Number(temperature) > 60
  ) {
    return "Sıcaklık -50 ile 60 °C arasında olmalıdır.";
  }

  if (
    humidity === "" ||
    !Number.isFinite(Number(humidity)) ||
    Number(humidity) < 0 ||
    Number(humidity) > 100
  ) {
    return "Nem değeri %0 ile %100 arasında olmalıdır.";
  }

  if (
    pm25 !== "" &&
    (!Number.isFinite(Number(pm25)) ||
      Number(pm25) < 0 ||
      Number(pm25) > 1000)
  ) {
    return "PM2.5 değeri 0 ile 1000 µg/m³ arasında olmalıdır.";
  }

  return "";
}

// 4. Basit, kurallara dayali risk gostergesi
function calculateRisk(temperature, humidity) {
  let level;

  // Bunlar prototip icin secilmis ornek esiklerdir.
  // Resmi veya klinik saglik esikleri degildir.
  if (temperature < 27) {
    level = 0;
  } else if (temperature < 32) {
    level = 1;
  } else if (temperature < 39) {
    level = 2;
  } else {
    level = 3;
  }

  // Yuksek nem, sicaklikla ilgili rahatsizligi artirabilir.
  // Bu kural da yalnizca egitim amacli bir varsayimdir.
  if (humidity >= 60 && level < 3) {
    level += 1;
  }

  return level;
}

// 5. Sonucu ekranda goster
weatherForm.addEventListener("submit", function (event) {
  event.preventDefault();

  errorMessage.textContent = "";

  const city = cityInput.value.trim();
  const temperature = temperatureInput.value;
  const humidity = humidityInput.value;
  const pm25 = pm25Input.value.trim();

  const validationError = validateData(
    city,
    temperature,
    humidity,
    pm25
  );

  if (validationError) {
    errorMessage.textContent = validationError;
    return;
  }

  const tempValue = Number(temperature);
  const humidityValue = Number(humidity);
  const riskLevel = calculateRisk(tempValue, humidityValue);
  const risk = RISK_LEVELS[riskLevel];

  // Sonuc basligi
  resultStatus.textContent =
    city + " için çevresel risk göstergesi: " + risk.name;

  // Risk seviyesine uygun aciklama
  let description;

  if (riskLevel === 0) {
    description =
      "Girilen sıcaklık, bu prototipin düşük risk aralığındadır. " +
      "Bu sonuç sağlık riskinin olmadığı anlamına gelmez.";
  } else if (riskLevel === 1) {
    description =
      "Sıcaklık koşullarına dikkat edin. Özellikle hassas " +
      "kişilerin belirtilere karşı dikkatli olması önemlidir.";
  } else if (riskLevel === 2) {
    description =
      "Sıcak koşullarda fiziksel eforu azaltın, serin bir yerde " +
      "dinlenin ve uygun şekilde sıvı tüketin.";
  } else {
    description =
      "Çok sıcak koşullar söz konusu olabilir. Serin bir ortamda " +
      "kalın, yorucu faaliyetlerden kaçının ve resmi uyarıları " +
      "takip edin. Acil belirtilerde tıbbi yardım alın.";
  }

  if (humidityValue >= 60) {
    description +=
      " Yüksek nem, vücudun terleme yoluyla serinlemesini zorlaştırabilir.";
  }

  resultDescription.textContent = description;

  // Renkli risk gostergesi
  riskIndicator.textContent = "Risk seviyesi: " + risk.name;
  riskIndicator.style.backgroundColor = risk.color;
  riskIndicator.style.color = risk.textColor;
  riskIndicator.style.borderColor = risk.textColor;
  riskIndicator.style.borderLeftWidth = "6px";
  riskIndicator.style.borderLeftStyle = "solid";
  riskIndicator.setAttribute(
    "aria-label",
    "Çevresel risk göstergesi: " + risk.name
  );

  // Veri kaynagini acikla
  if (pm25 === "") {
    dataSource.textContent =
      "Değerlendirme, kullanıcının girdiği sıcaklık ve nem " +
      "değerlerine dayanır. PM2.5 verisi girilmediği için " +
      "hava kirliliği değerlendirmeye dahil edilmemiştir.";
  } else {
    dataSource.textContent =
      "Değerlendirme, kullanıcının girdiği sıcaklık ve nem " +
      "değerlerine dayanır. Girilen PM2.5 değeri " +
      pm25 +
      " µg/m³ olarak kaydedildi; ölçüm süresi bilinmediğinden " +
      "bu değer risk seviyesine dahil edilmedi.";
  }

  dataSource.textContent +=
    " Canlı hava durumu verisi kullanılmamaktadır. " +
    "Bu sonuç eğitim amaçlı bir göstergedir; tıbbi teşhis " +
    "veya doğrulanmış sağlık riski tahmini değildir.";
});


const fetchWeatherButton = document.getElementById("fetch-weather");
const weatherMessage = document.getElementById("weather-message");

fetchWeatherButton.addEventListener("click", async function () {
  const city = cityInput.value.trim();

  if (!city) {
    weatherMessage.textContent = "Lütfen önce bir şehir adı girin.";
    return;
  }

  fetchWeatherButton.disabled = true;
  weatherMessage.textContent = "Hava durumu verileri alınıyor...";

  try {
    // 1. Şehir adını koordinatlara dönüştür.
    const geoUrl =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) +
      "&count=1&language=tr&format=json";

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Şehir arama servisine ulaşılamadı.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Şehir bulunamadı. Şehir adını kontrol edin.");
    }

    const place = geoData.results[0];

    // 2. Koordinatlarla güncel hava durumunu al.
    const weatherUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      place.latitude +
      "&longitude=" +
      place.longitude +
      "&current=temperature_2m,relative_humidity_2m" +
      "&timezone=auto";

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Hava durumu verisi alınamadı.");
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current) {
      throw new Error("Hava durumu verileri beklenen biçimde değil.");
    }

    // 2.1. PM2.5 hava kalitesi verisini al.
    let pm25Info = "PM2.5 verisi şu anda alınamadı.";

    try {
      const airQualityUrl =
        "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" +
        place.latitude +
        "&longitude=" +
        place.longitude +
        "&current=pm2_5" +
        "&timezone=auto";

      const airQualityResponse = await fetch(airQualityUrl);

      if (!airQualityResponse.ok) {
        throw new Error("Hava kalitesi verisi alınamadı.");
      }

      const airQualityData = await airQualityResponse.json();
      const pm25Value = airQualityData.current?.pm2_5;

      if (Number.isFinite(pm25Value)) {
        pm25Input.value = pm25Value;
        pm25Info =
          "PM2.5: " + pm25Value + " µg/m³. Ölçüm zamanı: " +
          airQualityData.current.time + ".";
      } else {
        pm25Input.value = "";
      }
    } catch (error) {
      pm25Input.value = "";
    }


    // 3. Gelen değerleri form alanlarına yerleştir.
    cityInput.value = place.name;
    temperatureInput.value = weatherData.current.temperature_2m;
    humidityInput.value = weatherData.current.relative_humidity_2m;

    const measuredAt = weatherData.current.time || "bilinmiyor";

    
    weatherMessage.textContent =
      place.name +
      " için hava durumu verileri alındı. Ölçüm zamanı: " +
      measuredAt +
      ". " +
      pm25Info +
      " Risk değerlendirmesi için Riski değerlendir düğmesine basın.";

    
    dataSource.textContent =
      "Hava durumu kaynağı: Open-Meteo. " +
      "Sıcaklık ve nem zamanı: " + measuredAt + ". " +
      pm25Info +
      " PM2.5 verisi hava kalitesi modelinden alınır ve mevcut risk seviyesine dahil edilmez.";
  } catch (error) {
    pm25Input.value = "";
    weatherMessage.textContent =
      error.message ||
      "Bir hata oluştu. Lütfen tekrar deneyin.";
  } finally {
    fetchWeatherButton.disabled = false;
  }
});
