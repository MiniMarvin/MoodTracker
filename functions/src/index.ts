import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


export const saveMood  = functions.https.onRequest( async (request, response) => {
	// Check for the saveMood data
	if (request.query.userid == null || request.query.mood == null) {
		response.send({status: "err"});
		return;
	}

	const docid: string = await makeid(30);
	const ref = db.collection('moods').doc(docid);
	const data = {
		userid: request.query.userid,
		mood: request.query.mood,
		TimeStamp: (new Date).getTime()
	}
	// console.log(JSON.stringify(ref, null, 2));
	console.log(JSON.stringify(data, null, 2));

	ref.set(data)
	.then((data: any) => {
		console.log(data);
		response.send({status: "ok", data: data});
		return;
	})
	.catch((err: any) => response.send({status: "err", err: err}));

	// response.send({status: "ok"});
});


export const getFeelings = functions.https.onRequest((request, response) => {
	db.collection('moods').get().then((snapshot: any) => {
		snapshot.forEach((doc: any) => {
			console.log(doc.id, ' -> ', doc.data());
		});
		response.send(snapshot);
	})
});


async function makeid(num: number, characters: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") {
	const len = characters.length;
	const arr = [...Array(num).keys()];

	return arr.map(v => characters.charAt(Math.floor(Math.random()*len))).join("");
}






