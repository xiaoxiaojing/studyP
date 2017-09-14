async function getStockPriceByName(name) {
  var symbol = await Symbol(name);
  // var stockPrice = await getStockPrice(symbol);
  return symbol;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});

async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 500);
