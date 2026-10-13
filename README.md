# JMeter Performance Testing (Local Mock API)

A basic load test built with **Apache JMeter** against a small local REST API. The goal of this project is to practise designing a JMeter test plan, running it in non-GUI mode, and reading the HTML dashboard report.

## Why a local mock server

I first built the test against the public [Restful API](https://api.restful-api.dev) service. During the first runs it started rejecting requests with HTTP 405, and the response said the limit is **50 requests per 24 hours**. Load testing a third-party public service is also not appropriate, so the test now targets a small Node.js mock API running on my own machine.

## Test setup

| Item | Value |
|---|---|
| Tool | Apache JMeter 5.6.3 (non-GUI mode) |
| Target | `mock-server.js`, a Node.js server on `http://localhost:3000` |
| Endpoints | `GET /objects` and `GET /objects/7` |
| Virtual users | 10 |
| Ramp-up | 10 seconds |
| Iterations per user | 20 (400 requests in total) |
| Think time | Constant Timer, 1000 ms after each request |
| Assertions | Response code equals 200, and response time at most 1000 ms |

## Results (run on 2026-10-13)

| Label | Samples | Errors | Average (ms) | Median (ms) | 90th pct (ms) | 95th pct (ms) | 99th pct (ms) | Max (ms) |
|---|---|---|---|---|---|---|---|---|
| GET objects list | 200 | 0 | 2.16 | 2 | 3 | 4 | 7.99 | 44 |
| GET single object | 200 | 0 | 1.89 | 2 | 3 | 3 | 5 | 7 |
| **Total** | **400** | **0 (0.00%)** | **2.02** | **2** | **3** | **4** | **7** | **44** |

The whole run took about 49 seconds, with an overall throughput of about 8.3 requests per second.

![JMeter statistics table](docs/statistics.png)

![JMeter console summary](docs/summary.png)

## How to read these results

- All 400 requests passed both assertions, with no errors.
- The throughput is limited mainly by the 1-second think time: 10 users that wait about one second between requests cannot send much more than 10 requests per second. So this run shows that the server handles this load easily, but it does **not** show the maximum capacity of the server.
- The mock server returns small, static data and runs on the same machine as JMeter. These numbers describe my local setup only, and they should not be compared with a real production application.

## Possible next steps

- Remove the think time and increase the number of users step by step, to find the point where response times or errors start to grow.
- Add a POST request with a request body.
- Run the same test against a deployed test environment, when one is available.

## How to run

1. Start the mock server (Node.js is required):

   ```
   node mock-server.js
   ```

2. In a second terminal, in the folder that contains `restful-api-load-local.jmx`, run JMeter in non-GUI mode:

   ```
   jmeter -n -t restful-api-load-local.jmx -l results.jtl -e -o report
   ```

   Before re-running, delete the old `results.jtl` and the `report` folder, because JMeter appends to the results file and refuses to write the report into a folder that already has content.

3. Open `report/index.html` in a browser.

## Files

| File | Purpose |
|---|---|
| `restful-api-load-local.jmx` | JMeter test plan |
| `mock-server.js` | Local mock REST API (Node.js) |
| `docs/` | Screenshots of the report |

## Author

**Ahmed Soliman**, Junior QA Engineer (ISTQB CTFL)

- LinkedIn: [linkedin.com/in/ahmed-soliman-qa](https://linkedin.com/in/ahmed-soliman-qa)
- GitHub: [github.com/9ahmedsoliman7](https://github.com/9ahmedsoliman7)
