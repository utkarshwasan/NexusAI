import React, { useContext, useState } from "react"; // <-- CORRECTED: Added useContext
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CoachingExpert } from "@/services/Options";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/_context/UserContext";

function UserInputDialog({ children, CoachingOptions }) {
  const [selectedExpert, setSelectedExpert] = useState();
  const [topic, setTopic] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(UserContext); // This line will now work

  const OnClickNext = async () => {
    setIsLoading(true);
    const result = await createDiscussionRoom({
      CoachingOptions: CoachingOptions?.name,
      topic: topic,
      expertName: selectedExpert,
      uid: userData?._id,
    });
    console.log(result);
    setIsLoading(false);
    setOpenDialog(false);
    router.push(`/discussion-room/` + result);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CoachingOptions.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3">
              <h2 className="text-black dark:text-white">
                Enter a topic to master your skills in {CoachingOptions.name}
              </h2>
              <Textarea
                placeholder="Enter your topic here"
                className="mt-5"
                onChange={(e) => setTopic(e.target.value)}
              />
              <h2 className="text-black dark:text-white mt-1.5">
                Select an expert to get started
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
                {CoachingExpert.map((expert, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedExpert(expert.name)}
                  >
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      width={100}
                      height={100}
                      className={`rounded-2xl h-[80px] w-[80px] object-cover
                      hover:scale-105 transition-all cursor-pointer p-1 border-primary
                      ${selectedExpert === expert.name ? "border-2" : ""}`}
                    />
                    <h2 className="text-center">{expert.name}</h2>
                  </div>
                ))}
              </div>
              <div className="flex gap-6 justify-end mt-5">
                <DialogClose asChild>
                  <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button
                  disabled={!selectedExpert || !topic || isLoading}
                  onClick={OnClickNext}
                >
                  {isLoading && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Next
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UserInputDialog;
