import { Application } from "express";
import {Module} from "module";
import { Config } from "../config";
import * as v388 from "../wmmt/v388.proto";

export default class StartupModule extends Module {
    register(app: Application): void {
        app.post('/method/register_system_info', (req, res) => {
            let msg = {
                error: v388.v388.protobuf.ErrorCode.ERR_SUCCESS,
                regionId: 1,
                placeId: "JPN0123",
                pajeroDiscloseAt: 0,
                carCampaignStartAt: 0,
                carCampaignEndAt: 0,
                teamSuspensionAnnouncementStartAt: 0,
                teamSuspensionStartAt: 0,
                successionCloseAnnouncementStartAt: 0,
                successionCloseAt: 0,
                successionCloseAnnouncementEndAt: 0,
                faceRecognitionPermitted: false,
                latestCompetitionId: 0
            }
            let resp = v388.v388.protobuf.RegisterSystemInfoResponse.encode(msg);
            let end = resp.finish();
            let r = res
                .header('Server', 'v388 wangan')
                .header('Content-Type', 'application/x-protobuf; revision=8053')
                .header('Content-Length', end.length.toString())
                .status(200);
            r.send(Buffer.from(end));
        })

        app.get('/resource/place_list', (req, res) => {
            console.log('place list');
            let places: v388.v388.protobuf.Place[] = [];
            places.push(new v388.v388.protobuf.Place({
                placeId: "JPN0123",
                regionId: 1,
                shopName: Config.getConfig().shopName,
                country: "JPN"
            }));
            let resp = v388.v388.protobuf.PlaceList.encode({places});
            let end = resp.finish();
            let r = res
                .header('Server', 'v388 wangan')
                .header('Content-Type', 'application/x-protobuf; revision=8053')
                .header('Content-Length', end.length.toString())
                .status(200);
            r.send(Buffer.from(end));
        })

        app.post('/method/ping', (req, res) => {
            console.log('ping');
            let body = v388.v388.protobuf.PingRequest.decode(req.body);
            let ping = {
                error: v388.v388.protobuf.ErrorCode.ERR_SUCCESS,
                pong: body.ping || 1
            };
            let resp = v388.v388.protobuf.PingResponse.encode(ping);
            let end = resp.finish();
            let r = res
                .header('Server', 'v388 wangan')
                .header('Content-Type', 'application/x-protobuf; revision=8053')
                .header('Content-Length', end.length.toString())
                .status(200);
            r.send(Buffer.from(end));
        })
    }
}