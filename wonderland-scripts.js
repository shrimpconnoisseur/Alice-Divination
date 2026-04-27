/* TODO:
 * - On page startup, show a disclaimer about character assets used for Alice and Yomi are NOT owned by me. They are owned by EPID Games from their mobile game Trickcal. Unless they click the "Disclaimer" button on the footer of the page, this notice will only show up once and never again after the user clicks the "close" button.
 * - Have a chance for another character, Yomi, to take Alice's place with a 10% chance on page startup or refresh. While Alice is more mischievous and taunting, Yomi is much more kind and sympathetic, which is to be reflected in their reactions to card pulls or random speeches.
 * - Track who is present so that appropriate GIFs are loaded/played.
 * - Clicking on their body triggers a random speech bubble. This cannot be performed after clicking the Draw Cards button until the Reset button is clicked.
 * - Add a Reset button.
 * - Clicking on their heads "bonks" them, playing their "smash" GIF variant. With the way the GIF works, play the GIF and then again for only a second. After the second GIF replay, change to one of their "angry" GIF variants for a couple seconds. Then return to a random "idle" GIF.
 * - Bonking them will trigger a random upset speech bubble.
 * 
 * Inlcuded is a list of the character GIFs:
 * Alice:
 * > alice_angry1.gif
 * > alice_angry2.gif
 * > alice_angry3.gif
 * > alice_averteyes.gif
 * > alice_happy1.gif
 * > alice_happy2.gif
 * > alice_idle1.gif
 * > alice_idle2.gif
 * > alice_ignore.gif
 * > alice_laugh.gif
 * > alice_pout.gif
 * > alice_sad1.gif
 * > alice_sad2.gif
 * > alice_smash.gif
 * > alice_surprised.gif
 * > alice_taunt1.gif
 * > alice_taunt2.gif
 * > alice_taunt3.gif
 * 
 * Yomi:
 * > yomi_angry1.gif
 * > yomi_angry2.gif
 * > yomi_dance.gif
 * > yomi_happy1.gif
 * > yomi_happy2.gif
 * > yomi_idle1.gif
 * > yomi_idle2.gif
 * > yomi_sad1.gif
 * > yomi_sad2.gif
 * > yomi_smash.gif
 * > yomi_surprised.gif
 * 
 * !!!!!!!!!!!!MOST IMPORTANT!!!!!!!!!!!!!
 * - Finish building the actual script.
 */

// Sign-up bubble toggle
const signupBubble   = document.getElementById('bubble-signup');
const signupDropdown = document.getElementById('signup-dropdown');

signupBubble?.addEventListener('click', (e) => {
  e.stopPropagation();
  signupDropdown.classList.toggle('open');
  signupBubble.classList.toggle('active');
});

// Close when clicking anywhere else
document.addEventListener('click', () => {
  signupDropdown?.classList.remove('open');
  signupBubble?.classList.remove('active');
});