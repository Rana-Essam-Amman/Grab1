/**
 * Static city-center coordinates for GPS-to-city matching.
 * Keys match English city names in src/data/locations/*.ts.
 */

interface CityCoords {
  readonly lat: number;
  readonly lng: number;
}

export const CITY_COORDS: Record<string, Record<string, CityCoords>> = {
  JO: {
    Amman: { lat: 31.9539, lng: 35.9106 },
    Irbid: { lat: 32.5556, lng: 35.85 },
    Zarqa: { lat: 32.0728, lng: 36.088 },
    Balqa: { lat: 32.0392, lng: 35.7272 },
    Madaba: { lat: 31.716, lng: 35.7939 },
    Jerash: { lat: 32.2808, lng: 35.8993 },
    Ajloun: { lat: 32.3333, lng: 35.75 },
    Karak: { lat: 31.1853, lng: 35.7048 },
    "Ma'an": { lat: 30.1962, lng: 35.734 },
    Tafilah: { lat: 30.8375, lng: 35.6042 },
    Mafraq: { lat: 32.3429, lng: 36.208 },
    Aqaba: { lat: 29.5321, lng: 35.0063 },
  },
  SA: {
    Riyadh: { lat: 24.7136, lng: 46.6753 },
    Jeddah: { lat: 21.5433, lng: 39.1728 },
    Dammam: { lat: 26.4207, lng: 50.0888 },
    Makkah: { lat: 21.3891, lng: 39.8579 },
    Madinah: { lat: 24.5247, lng: 39.5692 },
    Khobar: { lat: 26.2172, lng: 50.1971 },
    Taif: { lat: 21.2703, lng: 40.4158 },
    Buraidah: { lat: 26.326, lng: 43.975 },
    Tabuk: { lat: 28.3838, lng: 36.555 },
    Abha: { lat: 18.2164, lng: 42.5053 },
    'Khamis Mushait': { lat: 18.3, lng: 42.7333 },
  },
  LB: {
    Beirut: { lat: 33.8938, lng: 35.5018 },
    Tripoli: { lat: 34.4367, lng: 35.8497 },
    Saida: { lat: 33.5575, lng: 35.3729 },
    Jounieh: { lat: 33.9808, lng: 35.6178 },
    Zahle: { lat: 33.8463, lng: 35.902 },
    Baabda: { lat: 33.8339, lng: 35.5442 },
    Nabatieh: { lat: 33.3789, lng: 35.4839 },
    Tyre: { lat: 33.2705, lng: 35.2038 },
  },
  PS: {
    Jerusalem: { lat: 31.7683, lng: 35.2137 },
    Ramallah: { lat: 31.9038, lng: 35.2034 },
    Nablus: { lat: 32.2211, lng: 35.2544 },
    Hebron: { lat: 31.5326, lng: 35.0998 },
    Bethlehem: { lat: 31.7054, lng: 35.2024 },
    Jenin: { lat: 32.4607, lng: 35.3 },
    Tulkarm: { lat: 32.3104, lng: 35.0286 },
    Qalqilya: { lat: 32.1897, lng: 34.9706 },
  },
  SY: {
    Damascus: { lat: 33.5138, lng: 36.2765 },
    Aleppo: { lat: 36.2021, lng: 37.1343 },
    Homs: { lat: 34.7324, lng: 36.7137 },
    Hama: { lat: 35.1318, lng: 36.7578 },
    Latakia: { lat: 35.5317, lng: 35.7906 },
    Tartus: { lat: 34.889, lng: 35.8866 },
    'Deir ez-Zor': { lat: 35.3359, lng: 40.1408 },
    Raqqa: { lat: 35.9594, lng: 39.0025 },
  },
};
