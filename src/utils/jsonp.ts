import { FetchURL } from "../api";

export const FetchByJSONP = () => {
    const script = document.createElement("script");
    script.src = FetchURL;
    document.head.appendChild(script);
    setTimeout(function () {
      console.error("JSONP request timed out.");
      document.head.removeChild(script);
    }, 5000);
}

