const html = `
<link href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

<link href="https://cdn.jsdelivr.net/npm/lol-ranked-widget@LATEST/dist/style.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/lol-ranked-widget@LATEST/dist/script.js"></script>

<div class="widget"><div>
`

const fields = `
{
  "pauseDuration": {
    "type": "number",
    "label": "Swap pause duration (in seconds)",
    "value": 5000
  },
  "flipBorder": {
    "type": "dropdown",
    "label": "Flip border",
    "value": "true",
    "options": {
      "true": "Yes",
      "false": "No"
    }
  },
  "gameName": {
    "type": "text",
    "label": "Game name",
    "value": null
  },
  "tagLine": {
    "type": "text",
    "label": "Tag line",
    "value": null
  },
  "API_KEY": {
    "type": "password",
    "label": "Personal API Key",
    "value": null
  }
}
`