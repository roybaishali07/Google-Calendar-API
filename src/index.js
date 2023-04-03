// ACTUAL CODE WITHOUT INPUT

// import express from 'express'
// import axios from 'axios';
// import {google} from 'googleapis'
// import dotenv from "dotenv";
// import dayjs from 'dayjs';
// import {v4 as uuid} from 'uuid';


// dotenv.config({});
// const app = express()

// const calendar = google.calendar({
//     version : "v3",
//     auth : process.env.API
// })
// const PORT = process.env.NODE_ENV || 8000
// const oauth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URL
// )
// const scopes = ['https://www.googleapis.com/auth/calendar'];
// app.get('/google',(req,res)=>{
//     const url =  oauth2Client.generateAuthUrl({
//         access_type:"offline",
//         scope : scopes

//     })
//     res.redirect(url);
// });

// app.get('/google/redirect',async(req,res)=>{
//     const code = req.query.code;
//     const {tokens} = await oauth2Client.getToken(code)
//     oauth2Client.setCredentials(tokens)
        
//     res.send({
//         msg : "You have successfully logged in!"
//     });
// });


// app.get('/schedule_event',async(req,res)=>{
// console.log(oauth2Client.credentials.access_token);


//     await calendar.events.insert({
//         calendarId : "primary",
//         auth : oauth2Client,
//         conferenceDataVersion : 1,
//         requestBody :{
//             summary: "heya",
//                 description : "Very imp event!",
//                     start : {
//                         dateTime : dayjs(new Date()).add(1,'day').toISOString(),
//                         timeZone :"Asia/Kolkata"
//                     },
//                     end : {
//                         dateTime : dayjs(new Date()).add(1,'day').add(1,"hour").toISOString(),
//                         timeZone :"Asia/Kolkata"
//                     },
//                     conferenceData:{
//                         createRequest :
//                         {
//                             requestId : uuid(),
//                         },
//                     },
//                     attendees :  [{
//                         email : "duttashaan102@gmail.com"
//                     }]
//         }
//     });
//     res.send({
//         msg : "Done!"
//     })
// });
// app.listen(PORT,()=>{
//     console.log("Server started on port",PORT)
// })


    import express from 'express';
    import axios from 'axios';
    import { google } from 'googleapis';
    import dotenv from 'dotenv';
    import dayjs from 'dayjs';
    import { v4 as uuid } from 'uuid';
    import readline from 'readline';
    import moment from 'moment';

    dotenv.config({});
    const app = express();

    const calendar = google.calendar({
    version: 'v3',
    auth: process.env.API,
    });

    const PORT = process.env.NODE_ENV || 8000;

    const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL,
    );

    const scopes = ['https://www.googleapis.com/auth/calendar'];

    app.get('/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.redirect(url);
    });

        app.get('/google/redirect', async (req, res) => {
            const options = req.query;
            if (!options || !options.code) {
            res.status(400).send('Bad request');
            return;
            }
        
            const { tokens } = await oauth2Client.getToken(options.code);
            oauth2Client.setCredentials(tokens);
            
            res.send({
            msg: 'You have successfully logged in!',
            
            });
            
        });
        

    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    });

    //SCHEDULE EVENTS
    app.get('/schedule_event', async (req, res) => {
        rl.question('Enter event summary: ', async (summary) => {
            rl.question('Enter email addresses of attendees (separated by commas): ', async (emails) => {
                const attendees = emails.split(',').map(email => ({ email: email.trim() }));
                
                rl.question('Enter event description: ', async (description) => {
                    rl.question('Enter start date (YYYY-MM-DD): ', async (startDate) => {
                        rl.question('Enter end date (YYYY-MM-DD): ', async (endDate) => {
                            rl.question('Enter start time (HH:mm:ss): ', async (startTime) => {
                                rl.question('Enter end time (HH:mm:ss): ', async (endTime) => {
                                    rl.question('Enter comma-separated days of the week (e.g. Mon,Tue,Wed): ', async (days) => {
                                        rl.question('Enter color ID (optional): Select\n"1": Lavender\n"2": Sage\n"3": Grape\n"4": Flamingo\n"5": Banana\n"6": Tangerine\n"7": Peacock\n"8": Graphite\n"9": Blueberry\n"10": Basil\n"11": Tomato\n"12": Midnight :- ', async (color) => {
                                            rl.question('Enter reminder time before event start (in minutes): ', async (reminder) => {
                                                console.log(oauth2Client.credentials.access_token);
                                                
                                                const weekdays = days.split(',');
                                                const startOfWeek = moment(startDate);
                                                const endOfWeek = moment(endDate);
                                                let currDate = moment(startOfWeek);
                                                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                let currDay = currDate.day();
                                                
                                                while (currDate.isSameOrBefore(endOfWeek)) {
                                                    if (weekdays.includes(dayNames[currDay])) {
                                                        const startDateTime = moment(`${currDate.format('YYYY-MM-DD')} ${startTime}`).toISOString();
                                                        const endDateTime = moment(`${currDate.format('YYYY-MM-DD')} ${endTime}`).toISOString();
                                                        
                                                        await calendar.events.insert({
                                                            calendarId: 'primary',
                                                            auth: oauth2Client,
                                                            conferenceDataVersion: 1,
                                                            requestBody: {
                                                                summary,
                                                                description,
                                                                start: {
                                                                    dateTime: startDateTime,
                                                                    timeZone: 'Asia/Kolkata',
                                                                },
                                                                end: {
                                                                    dateTime: endDateTime,
                                                                    timeZone: 'Asia/Kolkata',
                                                                },
                                                                conferenceData: {
                                                                    createRequest: {
                                                                        requestId: uuid(),
                                                                    },
                                                                },
                                                                attendees,
                                                                reminders: {
                                                                    useDefault: false,
                                                                    overrides: [
                                                                        {
                                                                            method: 'popup',
                                                                            minutes: Number(reminder),
                                                                        },
                                                                    ],
                                                                },
                                                                colorId: Number(color),
                                                            },
                                                        });
                                                        
                                                    }
                                                    currDate.add(1, 'day');
                                                    currDay = currDate.day();
                                                }
                                                
                                                console.log('Events created successfully');
                                                res.send({
                                                    msg: 'Done!',
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    //LIST EVENTS
    app.get('/list_events', async (req, res) => {
            rl.question('Enter start date (YYYY-MM-DD): ', async (startDate) => {
            rl.question('Enter end date (YYYY-MM-DD): ', async (endDate) => {
                const events = await calendar.events.list({
                calendarId: 'primary',
                timeMin: `${startDate}T00:00:00.000Z`,
                timeMax: `${endDate}T23:59:59.999Z`,
                auth: oauth2Client,
                });
        
                console.log(`Events from ${startDate} to ${endDate}:`);
                console.log(events.data.items);
                res.send({
                msg: 'Done!',
                });
            });
        });
    });
    

    //UPDATE EVENTS
        app.get('/update_event', async (req, res) => {
            rl.question('Enter the ID of the event to update: ', async (eventId) => {
            try {
                // Get the event details
                const event = await calendar.events.get({
                calendarId: 'primary',
                eventId,
                auth: oauth2Client,
                });
        
                // Prompt the user for updated information
                rl.question('Enter new summary (leave blank to keep current): ', (summary) => {
                rl.question('Enter new description (leave blank to keep current): ', (description) => {
                    rl.question('Enter new start date and time (YYYY-MM-DD HH:mm:ss) (leave blank to keep current): ', (startDateTime) => {
                    rl.question('Enter new end date and time (YYYY-MM-DD HH:mm:ss) (leave blank to keep current): ', (endDateTime) => {
                        rl.question('Enter new color ID (1-11) (leave blank to keep current): ', (colorId) => {
                        rl.question('Enter new reminder time in minutes (leave blank to keep current): ', async (reminder) => {
                            // Update the event with the new information
                            const updatedEvent = {
                            summary: summary || event.data.summary,
                            description: description || event.data.description,
                            start: {
                                dateTime: startDateTime || event.data.start.dateTime,
                                timeZone: event.data.start.timeZone,
                            },
                            end: {
                                dateTime: endDateTime || event.data.end.dateTime,
                                timeZone: event.data.end.timeZone,
                            },
                            colorId: colorId ? Number(colorId) : event.data.colorId,
                            reminders: {
                                useDefault: false,
                                overrides: [
                                {
                                    method: 'popup',
                                    minutes: Number(reminder) || event.data.reminders.overrides[0].minutes,
                                },
                                ],
                            },
                            };
        
                            // Update the event on the Google Calendar server
                            const updated = await calendar.events.patch({
                            calendarId: 'primary',
                            eventId,
                            auth: oauth2Client,
                            requestBody: updatedEvent,
                            });
        
                            console.log('Event updated:', updated.data);
        
                            res.send({
                            msg: 'Event updated!',
                            });
                        });
                        });
                    });
                    });
                });
                });
            } catch (error) {
                console.error('Error updating event:', error);
                res.status(500).send('Error updating event');
            }
            });
        });

    app.listen(PORT, () => {
    console.log('Server started on port', PORT);
    });
