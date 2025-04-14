import "../CSS/main.css";

import p1 from "../images/profiles/applicationKoala1Prof.png";
import p2 from "../images/profiles/applicationKoala2Prof.png";
import p3 from "../images/profiles/applicationKoala3Prof.png";
import p4 from "../images/profiles/applicationKoala4Prof.png";
import p5 from "../images/profiles/interviewKoala1Prof.png";
import p6 from "../images/profiles/interviewKoala2Prof.png";
import p7 from "../images/profiles/interviewKoala3Prof.png";
import p8 from "../images/profiles/offerKoalaProf.png";

export default function Stats({
  username,
  numApps,
  numInterviews,
  numOffers,
  numKoalas,
}) {
  return (
    <div className="notes">
      <div class="stats">
        <div class="rowS">
          <h2>Hello, {username}!</h2>
        </div>
        <div class="statNotes">
          <h3 class="bronze">Applications - {numApps}</h3>
          <h3 class="silver">Interviews - {numInterviews}</h3>
          <h3 class="gold">Offer(s) - {numOffers}</h3>
          <h3 class="kCount">Koala(s) - {numKoalas}</h3>
        </div>
        <h4 className="QuestTitle">Quests:</h4>
        <div class="statNotes over">
          {10 - numApps <= 0 ? (
            <></>
          ) : (
            <h3 class="bronze">
              Apply to {10 - numApps} Jobs{" "}
              <img src={p1} alt="prof" class="prof"></img>
            </h3>
          )}
          {25 - numApps <= 0 ? (
            <></>
          ) : (
            <h3 class="bronze">
              Apply to {25 - numApps} Jobs{" "}
              <img src={p2} alt="prof" class="prof"></img>
            </h3>
          )}
          {50 - numApps <= 0 ? (
            <></>
          ) : (
            <h3 class="bronze">
              Apply to {50 - numApps} Jobs{" "}
              <img src={p3} alt="prof" class="prof"></img>
            </h3>
          )}
          {100 - numApps <= 0 ? (
            <></>
          ) : (
            <h3 class="bronze">
              Apply to {100 - numApps} Jobs{" "}
              <img src={p4} alt="prof" class="prof"></img>
            </h3>
          )}
          {1 - numInterviews <= 0 ? (
            <></>
          ) : (
            <h3 class="silver">
              Your First Interview! <img src={p5} alt="prof" class="prof"></img>
            </h3>
          )}
          {5 - numInterviews <= 0 ? (
            <></>
          ) : (
            <h3 class="silver">
              Have {5 - numInterviews} Interviews{" "}
              <img src={p6} alt="prof" class="prof"></img>
            </h3>
          )}
          {10 - numInterviews <= 0 ? (
            <></>
          ) : (
            <h3 class="silver">
              Have {10 - numInterviews} Interviews{" "}
              <img src={p7} alt="prof" class="prof"></img>
            </h3>
          )}
          <h3 class="gold">
            Secure An Offer! <img src={p8} alt="prof" class="prof"></img>
          </h3>
        </div>
      </div>
    </div>
  );
}
