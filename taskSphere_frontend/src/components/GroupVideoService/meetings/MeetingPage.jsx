
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AudioVolumeIndicator from "../streamComponents/AudioVolumeIndicator";
import Button, { buttonClassName } from "../streamComponents/Button";
import FlexibleCallLayout from "../streamComponents/FlexibleCallLayout";
import PermissionPrompt from "../streamComponents/PermissionPrompts";
import RecordingsList from "../streamComponents/RecordingsList";
import useLoadCall from "../hooks/useLoadCall";
import useStreamCall from "../hooks/useStreamCall";
import {
  CallingState,
  DeviceSettings,
  StreamCall,
  StreamTheme,
  VideoPreview,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function MeetingPage() {
  const { callId } = useParams();
  const { user, status } = useSelector((state) => state.user)

  const { call, callLoading } = useLoadCall(callId);

  if (!status || callLoading) {
    return (<div className=" w-[100vw] h-[100vh] flex items-center justify-center">
      <Loader2 className="mx-auto animate-spin" />;
    </div>)
  }

  if (!call) {
    return <p className="text-center font-bold">Call not found</p>;
  }

  const notAllowedToJoin =
    call.type === "card-members" &&
    (!user || !call.state.members.find((m) => m.user.id === user._id));

  if (notAllowedToJoin) {
    return (
      <p className="text-center font-bold">
        You are not allowed to view this meeting
      </p>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        <MeetingScreen />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen() {
  const call = useStreamCall();

  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();

  const callEndedAt = useCallEndedAt();
  const callStartsAt = useCallStartsAt();

  const [setupComplete, setSetupComplete] = useState(false);

  async function handleSetupComplete() {
    call.join();
    setSetupComplete(true);
  }

  const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  if (callHasEnded) {
    return <MeetingEndedScreen />;
  }

  if (callIsInFuture) {
    return <UpcomingMeetingScreen />;
  }

  const description = call.state.custom.description;

  return (
    <div className="space-y-6">
      {description && (
        <p className="text-center">
          Meeting description: <span className="font-bold">{description}</span>
        </p>
      )}
      {setupComplete ? (
        <CallUI />
      ) : (
        <SetupUI onSetupComplete={handleSetupComplete} />
      )}
    </div>
  );
}



function SetupUI({ onSetupComplete }) {
  const call = useStreamCall();

  const { useMicrophoneState, useCameraState } = useCallStateHooks();

  const micState = useMicrophoneState();
  const camState = useCameraState();

  const [micCamDisabled, setMicCamDisabled] = useState(false);

  useEffect(() => {
    if (micCamDisabled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [micCamDisabled, call]);

  if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
    return <PermissionPrompt />;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center gap-3">
        <AudioVolumeIndicator />
        <DeviceSettings />
      </div>
      <label className="flex items-center gap-2 font-medium">
        <input
          type="checkbox"
          checked={micCamDisabled}
          onChange={(e) => setMicCamDisabled(e.target.checked)}
        />
        Join with mic and camera off
      </label>
      <Button onClick={onSetupComplete}>Join meeting</Button>
    </div>
  );
}

function CallUI() {
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {

    return (<div className=" w-[100vw] h-[100vh] flex items-center justify-center">
      <Loader2 className="mx-auto animate-spin" />;
    </div>)
  }

  return <FlexibleCallLayout />;
}

function UpcomingMeetingScreen() {
  const call = useStreamCall();
  const { cardId } = useParams()

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="my-3">
        This meeting has not started yet. It will start at{" "}
        <span className="font-bold">
          {call.state.startsAt?.toLocaleString()}
        </span>
      </p>
      {call.state.custom.description && (
        <p>
          Description:{" "}
          <span className="font-bold">{call.state.custom.description}</span>
        </p>
      )}
      <Link to={`/board/card/${cardId}/meetings`} className={buttonClassName}>
        See more meetings
      </Link>
    </div>
  );
}

function MeetingEndedScreen() {
  const { cardId } = useParams()
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-bold my-3">This meeting has ended</p>
      <Link to={`/board/card/${cardId}/meetings`} className={buttonClassName}>
        Upcoming meetings
      </Link>
      <div className="space-y-3">
        <h2 className="text-center text-xl font-bold">Recordings</h2>
        <RecordingsList />
      </div>
    </div>
  );
}
