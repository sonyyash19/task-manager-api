const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');


test("Should calculate total with tip", () => {
    const total = calculateTip(10, .3);

    expect(total).toBe(13);
})

test("Should calculate total with default value", () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
})

test("Should convert 32F to 0C", () => {
    const temperature = fahrenheitToCelsius(32);
    expect(temperature).toBe(0);
})

test("Should convert 0C to 32F", () => {
    const temperature = celsiusToFahrenheit(0);
    expect(temperature).toBe(32);
})

// test('Async test', (done) => {
//     add(2, 3).then((sum) => {
//         expect(sum).toBe(5);
//         done();
//     })
// })

test('Async test2', async () => {
    const sum = await add(2,3);
    expect(sum).toBe(5);
})