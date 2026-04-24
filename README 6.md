# README - Naše hra LAN Infiltrator

### Projekt vypracovali:
* **Michal Bubna**
* **Rudolf Selinka**
* **Vít Pospíšil**

---

## O čem to vlastně je?
V téhle hře si zahraješ na hackera. Tvým úkolem je nabourat se do sítě jedné firmy a zavirovat tam všech 9 místností. Když se ti povede ovládnout úplně všechno, vyhrál jsi.

Ale pozor – není to jen tak. Čím víc věcí v terminálu zkoušíš, tím víc o tobě systém ví. Máš tam nahoře ukazatel "Detection Level", a jakmile vyletí na 100 %, admin tě odpojí a končíš.

## Jak se to hraje?
Celá hra běží v terminálu, kam píšeš příkazy.

**Napadení:** Když chceš nějakou místnost ovládnout, musíš vyřešit takovou mini-hru – systém ti vyhodí kód a ty ho musíš bleskově napsat pozpátku.

**Zámky a hesla:** Do některých místností (třeba k šéfovi nebo do serverovny) se nedostaneš jen tak. Musíš nejdřív hacknout jiné místnosti a v nich přes příkaz `search` najít přístupové klíče.

**Mapa:** Na mapě hned vidíš, kde už jsi byl (zelená), kde na tebe čeká zámek (červená) a co je ještě volné (modrá).

## Co můžeš v konzoli psát?
* `help` – Když nevíš, co dál.
* `scan` – Ukáže ti seznam místností a v jakém jsou stavu.
* `infect [id]` – Tímhle začneš útok na konkrétní místnost.
* `search [id]` – Prohledáš už hacknutou místnost, jestli v ní není nějaké heslo nebo klíč.
* `clear` – Promažeš si text v terminálu, aby v tom nebyl nepořádek.

## Co jsme použili a jak to vzniklo?
* Udělali jsme to pomocí **HTML, CSS a JavaScriptu**.
* S logikou a některými složitějšími částmi kódu nám pomohla **umělá inteligence**.
* Celý svět (místnosti a jejich propojení) je vymyšlený tak, aby se dal snadno měnit nebo rozšiřovat.