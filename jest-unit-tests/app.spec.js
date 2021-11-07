
const app = require("../app");
const fetch = require("node-fetch");
jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');


const testJSON = {
    coord: { lon: 12.5655, lat: 55.6759 },
    weather: [
        {
            id: 802,
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d'
        }
    ],
    base: 'stations',
    main: {
        temp: 297.8,
        feels_like: 298.25,
        temp_min: 296.34,
        temp_max: 299.16,
        pressure: 1008,
        humidity: 74
    },
    visibility: 10000,
    wind: { speed: 6.17, deg: 230 },
    clouds: { all: 50 },
    dt: 1624208873,
    sys: {
        type: 2,
        id: 2035645,
        country: 'DK',
        sunrise: 1624155913,
        sunset: 1624219044
    },
    timezone: 7200,
    id: 2618425,
    name: 'Copenhagen',
    cod: 200
};

const finalJSON = {
    city: 'Copenhagen',
    temperature: "24°C",
    humidity: 74,
    wind: "6.17 m/s Sydvest"
};


describe("Tests the temperature conversion function", () => {
    let temp;
    it("Tests 274 K to Celcius", () => {
        temp = app.convertKelvinToCelcius(274);
        expect(temp).toBe(0);
    });
    it("Tests 300 K to Celcius", () => {
        temp = app.convertKelvinToCelcius(300);
        expect(temp).toBe(26);
    });
    it("Tests 224 K to Celcius", () => {
        temp = app.convertKelvinToCelcius(224);
        expect(temp).toBe(-50);
    });
})

describe("Tests the degreesToDirection conversion function", () => {
    let direction;
    it("Tests 130 degrees", () => {
        direction = app.convertDegreesToDirection(130);
        expect(direction).toBe('Sydøst');
    });
    it("Tests 315 degrees", () => {
        direction = app.convertDegreesToDirection(315);
        expect(direction).toBe('Nordvest');
    });
    it("Tests 347 degrees", () => {
        direction = app.convertDegreesToDirection(347);
        expect(direction).toBe('Nord-Nordvest');
    });
})

describe("Tests the json preparation function", () => {
    let obj;
    it("Tests status code 200", () => {
        obj = app.prepareObject(testJSON);
        expect(obj).toStrictEqual(finalJSON);
    });
    it("Tests status code 404", () => {
        obj = app.prepareObject({ cod: 404 });
        expect(obj).toBe('City not found');
    });
})

describe("Tests the creation of the HTML template", () => {
    let obj;
    it("Tests with sample JSON", () => {
        obj = app.preparePage(finalJSON);
        expect(obj.includes('<!DOCTYPE html>')).toBe(true);
        expect(obj.includes('Copenhagen')).toBe(true);
        expect(obj.includes('Sydvest')).toBe(true);
    })
})

describe("Tests the setting of the JS flag", () => {
    let isEnabled;
    it("Tests for disabled JS", () => {
        isEnabled = app.setJSFlag("disabled");
        expect(isEnabled).toBe(false);
    });
    it("Test for enabled JS", () => {
        isEnabled = app.setJSFlag("enabled");
        expect(isEnabled).toBe(true);
    });
})


describe("Tests the API call using a mock", () => {
    it('returns the city data object', async () => {
        fetch.mockResolvedValue(new Response(JSON.stringify(testJSON)));
        const obj = await app.fetchCityWeatherData("Copenhagen");
        expect(obj).toStrictEqual(finalJSON);

    });
    it('returns the city is not found', async () => {
        fetch.mockResolvedValue(new Response(JSON.stringify({cod:404, message: "City not found"})));
        const obj = await app.fetchCityWeatherData("Dopenhagen");
        expect(obj).toStrictEqual("City not found");
    });
})

