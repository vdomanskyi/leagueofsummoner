# League of Summoner Widget

The **League of Summoner** widget displays real-time data for a summoner, including:

- **Rank**
- **Tier**
- **Wins**
- **Losses**
- **Total Matches**
- **Win Percentage**
- **Match History**

The widget updates data every **15 seconds**.
**No data is stored on our servers.**
Requests are proxied through an **AWS Lambda function**, with the proxy server code available at `dist/lambda.js`.

---

## How to Use

1. **Create an Overlay in StreamElements**
   - Set the dimensions to **200px width** and **300px height**.

2. **Add Code to StreamElements**
   - Open the file `dist/streamelements.txt`.
   - This file contains code snippets that must be copied into specific tabs in StreamElements Overlay.
   - Ensure all tabs not mentioned in the file remain **empty**.

3. **Update the Widget Version**
   - Replace the placeholder `LATEST` in the copied code with the **current version** (e.g., `1.0.1`).

4. **Configure Sidebar Fields**
   - Fill in the following fields in the sidebar:
     - **Game Name**
     - **Tag Line**
     - **Personal API Key**: Obtain your API key from the [Riot Developer Portal](https://developer.riotgames.com/app-type).
       ⚠️ **Important:** Keep your API key secure. Do not share or display it to others. It is stored as a password-type field in the sidebar but can still be accessed in the **DATA tab**. Ensure the **DATA tab** is never shown to anyone.

5. **Initialize the Widget**
   - After setting up the overlay, allow up to **5 seconds** for data to load.

---

## Legal Disclaimer

- All **summoner icons**, **champion icons**, **league icons**, and **League of Legends data** are proprietary to Riot Games.
- This widget is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends or Teamfight Tactics.
- **League of Legends** and **Teamfight Tactics** are trademarks or registered trademarks of Riot Games, Inc.
- **League of Legends © Riot Games, Inc.**
