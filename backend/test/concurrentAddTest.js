// concurrentAddTest.js
// Simple script to simulate two concurrent addToCart GraphQL mutations.
// Requires Node 18+ (global fetch).
// Usage example (PowerShell):
// $env:GRAPHQL_URL='http://localhost:6000/graphql';
// $env:USER_TOKEN='Bearer <ACCESS_TOKEN>';
// $env:USER_ID='<USER_ID>';
// $env:PRODUCT_ID='<PRODUCT_ID>';
// node backend/test/concurrentAddTest.js

const fetch = require('node-fetch');

const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:6000/graphql';
const TOKEN = process.env.USER_TOKEN || '';
const USER_ID = process.env.USER_ID || '';
const PRODUCT_ID = process.env.PRODUCT_ID || '';
const QTY = Number(process.env.QUANTITY || '1');

if (!TOKEN || !USER_ID || !PRODUCT_ID) {
  console.error('Please set GRAPHQL_URL, USER_TOKEN, USER_ID and PRODUCT_ID environment variables.');
  process.exit(1);
}

const query = `mutation AddToCart($input: AddToCartInput!){ addToCart(input:$input){ id items{ productId quantity } } }`;

const body = {
  operationName: 'AddToCart',
  query,
  variables: {
    input: {
      userId: USER_ID,
      items: [{ productId: PRODUCT_ID, quantity: QTY }]
    }
  }
};

async function sendRequest(i){
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN
    },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  console.log(`Request #${i} status: ${res.status}`);
  console.log(JSON.stringify(json, null, 2));
  return json;
}

(async () => {
  console.log('Sending two concurrent addToCart requests...');
  const p1 = sendRequest(1);
  const p2 = sendRequest(2);
  const [r1, r2] = await Promise.all([p1, p2]);
  console.log('Both completed.');
})();
