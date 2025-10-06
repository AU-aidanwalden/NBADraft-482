import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import { getServerSession } from "@/app/actions";

interface DraftsPageProps {
  params: Promise<{ year: string }>;
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const { year } = await params;
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <Header session={session} />
      <main className="bg-white p-5 rounded-xl shadow-md max-w-4xl mx-auto">
        <h2 className={styles.title}>{year} NBA Draft</h2>
        <div className={styles["player-list"]}>
          {/* TODO: Replace with dynamic data */}
          {/* Round 1 */}
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#1</span>
            <span className={styles["player-name"]}>Cooper Flagg</span>
            <span className={styles["team-name"]}>Dallas Mavericks</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#2</span>
            <span className={styles["player-name"]}>Dylan Harper</span>
            <span className={styles["team-name"]}>San Antonio Spurs</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#3</span>
            <span className={styles["player-name"]}>V.J. Edgecombe</span>
            <span className={styles["team-name"]}>Philadelphia 76ers</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#4</span>
            <span className={styles["player-name"]}>Kon Knueppel</span>
            <span className={styles["team-name"]}>Charlotte Hornets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#5</span>
            <span className={styles["player-name"]}>Ace Bailey</span>
            <span className={styles["team-name"]}>Utah Jazz</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#6</span>
            <span className={styles["player-name"]}>Tre Johnson</span>
            <span className={styles["team-name"]}>Washington Wizards</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#7</span>
            <span className={styles["player-name"]}>Jeremiah Fears</span>
            <span className={styles["team-name"]}>New Orleans Pelicans</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#8</span>
            <span className={styles["player-name"]}>Egor Demin</span>
            <span className={styles["team-name"]}>Brooklyn Nets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#9</span>
            <span className={styles["player-name"]}>Collin Murray-Boyles</span>
            <span className={styles["team-name"]}>Toronto Raptors</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#10</span>
            <span className={styles["player-name"]}>Khaman Maluach</span>
            <span className={styles["team-name"]}>Phoenix Suns</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#11</span>
            <span className={styles["player-name"]}>Cedric Coward</span>
            <span className={styles["team-name"]}>Memphis Grizzlies</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#12</span>
            <span className={styles["player-name"]}>Noa Essengue</span>
            <span className={styles["team-name"]}>Chicago Bulls</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#13</span>
            <span className={styles["player-name"]}>Derik Queen</span>
            <span className={styles["team-name"]}>New Orleans Pelicans</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#14</span>
            <span className={styles["player-name"]}>Carter Bryant</span>
            <span className={styles["team-name"]}>San Antonio Spurs</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#15</span>
            <span className={styles["player-name"]}>Thomas Sorber</span>
            <span className={styles["team-name"]}>Oklahoma City Thunder</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#16</span>
            <span className={styles["player-name"]}>Yang Hansen</span>
            <span className={styles["team-name"]}>Portland Trail Blazers</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#17</span>
            <span className={styles["player-name"]}>Joan Beringer</span>
            <span className={styles["team-name"]}>Minnesota Timberwolves</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#18</span>
            <span className={styles["player-name"]}>Walter Clayton Jr.</span>
            <span className={styles["team-name"]}>Utah Jazz</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#19</span>
            <span className={styles["player-name"]}>Nolan Traore</span>
            <span className={styles["team-name"]}>Brooklyn Nets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#20</span>
            <span className={styles["player-name"]}>Kasparas Jakučionis</span>
            <span className={styles["team-name"]}>Miami Heat</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#21</span>
            <span className={styles["player-name"]}>Will Riley</span>
            <span className={styles["team-name"]}>Washington Wizards</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#22</span>
            <span className={styles["player-name"]}>Drake Powell</span>
            <span className={styles["team-name"]}>Brooklyn Nets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#23</span>
            <span className={styles["player-name"]}>Asa Newell</span>
            <span className={styles["team-name"]}>New Orleans Pelicans</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#24</span>
            <span className={styles["player-name"]}>Nique Clifford</span>
            <span className={styles["team-name"]}>Oklahoma City Thunder</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#25</span>
            <span className={styles["player-name"]}>Jase Richardson</span>
            <span className={styles["team-name"]}>Orlando Magic</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#26</span>
            <span className={styles["player-name"]}>Ben Saraf</span>
            <span className={styles["team-name"]}>Brooklyn Nets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#27</span>
            <span className={styles["player-name"]}>Danny Wolf</span>
            <span className={styles["team-name"]}>Brooklyn Nets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#28</span>
            <span className={styles["player-name"]}>Hugo González</span>
            <span className={styles["team-name"]}>Boston Celtics</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#29</span>
            <span className={styles["player-name"]}>Liam McNeeley</span>
            <span className={styles["team-name"]}>Phoenix Suns</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#30</span>
            <span className={styles["player-name"]}>
              Yanic Konan Niederhauser
            </span>
            <span className={styles["team-name"]}>Los Angeles Clippers</span>
          </div>
          {/* Round 2 */}
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#31</span>
            <span className={styles["player-name"]}>Rasheer Fleming</span>
            <span className={styles["team-name"]}>
              Minnesota Timberwolves (traded to Suns)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#32</span>
            <span className={styles["player-name"]}>Noah Penda</span>
            <span className={styles["team-name"]}>
              Boston Celtics (traded to Magic)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#33</span>
            <span className={styles["player-name"]}>Sion James</span>
            <span className={styles["team-name"]}>Charlotte Hornets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#34</span>
            <span className={styles["player-name"]}>Ryan Kalkbrenner</span>
            <span className={styles["team-name"]}>Charlotte Hornets</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#35</span>
            <span className={styles["player-name"]}>Johni Broome</span>
            <span className={styles["team-name"]}>Philadelphia 76ers</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#36</span>
            <span className={styles["player-name"]}>Adou Thiero</span>
            <span className={styles["team-name"]}>
              Brooklyn Nets (traded to Lakers)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#37</span>
            <span className={styles["player-name"]}>Chaz Lanier</span>
            <span className={styles["team-name"]}>Detroit Pistons</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#38</span>
            <span className={styles["player-name"]}>Kam Jones</span>
            <span className={styles["team-name"]}>
              San Antonio Spurs (traded to Pacers)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#39</span>
            <span className={styles["player-name"]}>Alijah Martin</span>
            <span className={styles["team-name"]}>Toronto Raptors</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#40</span>
            <span className={styles["player-name"]}>Micah Peavy</span>
            <span className={styles["team-name"]}>
              Washington Wizards (traded to Pelicans)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#41</span>
            <span className={styles["player-name"]}>Koby Brea</span>
            <span className={styles["team-name"]}>
              Golden State Warriors (traded to Suns)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#42</span>
            <span className={styles["player-name"]}>Maxime Raynaud</span>
            <span className={styles["team-name"]}>Sacramento Kings</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#43</span>
            <span className={styles["player-name"]}>Jamir Watkins</span>
            <span className={styles["team-name"]}>Washington Wizards</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#44</span>
            <span className={styles["player-name"]}>Brooks Barnhizer</span>
            <span className={styles["team-name"]}>Oklahoma City Thunder</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#45</span>
            <span className={styles["player-name"]}>Rocco Zikarsky</span>
            <span className={styles["team-name"]}>
              Chicago Bulls (traded to Wolves)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#46</span>
            <span className={styles["player-name"]}>Amari Williams</span>
            <span className={styles["team-name"]}>
              Orlando Magic (traded to Celtics)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#47</span>
            <span className={styles["player-name"]}>Bogoljub Marković</span>
            <span className={styles["team-name"]}>Milwaukee Bucks</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#48</span>
            <span className={styles["player-name"]}>Javon Small</span>
            <span className={styles["team-name"]}>Memphis Grizzlies</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#49</span>
            <span className={styles["player-name"]}>Tyrese Proctor</span>
            <span className={styles["team-name"]}>Cleveland Cavaliers</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#50</span>
            <span className={styles["player-name"]}>Kobe Sanders</span>
            <span className={styles["team-name"]}>
              New York Knicks (traded to Clippers)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#51</span>
            <span className={styles["player-name"]}>Mohamed Diawara</span>
            <span className={styles["team-name"]}>
              Los Angeles Clippers (traded to Knicks)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#52</span>
            <span className={styles["player-name"]}>Alex Toohey</span>
            <span className={styles["team-name"]}>
              Phoenix Suns (traded to Warriors)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#53</span>
            <span className={styles["player-name"]}>John Tonje</span>
            <span className={styles["team-name"]}>Utah Jazz</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#54</span>
            <span className={styles["player-name"]}>Taelon Peter</span>
            <span className={styles["team-name"]}>Indiana Pacers</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#55</span>
            <span className={styles["player-name"]}>Lachlan Olbrich</span>
            <span className={styles["team-name"]}>
              Los Angeles Lakers (traded to Bulls)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#56</span>
            <span className={styles["player-name"]}>Will Richard</span>
            <span className={styles["team-name"]}>
              Memphis Grizzlies (traded to Warriors)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#57</span>
            <span className={styles["player-name"]}>Max Shulga</span>
            <span className={styles["team-name"]}>
              Magic (traded to Celtics)
            </span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#58</span>
            <span className={styles["player-name"]}>Saliou Niang</span>
            <span className={styles["team-name"]}>Cleveland Cavaliers</span>
          </div>
          <div className={styles["player-rows"]}>
            <span className={styles["draft-pick"]}>#59</span>
            <span className={styles["player-name"]}>Jahmai Mashack</span>
            <span className={styles["team-name"]}>
              Houston Rockets (traded to Grizzlies)
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
