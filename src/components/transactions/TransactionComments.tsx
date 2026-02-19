//import { useState } from "react";
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
//import { Textarea } from "@/components/ui/textarea";
//import { Badge } from "@/components/ui/badge";
//import { Avatar, AvatarFallback } from "@/components/ui/avatar";
//import { MessageSquare, Send, Building2, Landmark, MapPin } from "lucide-react";
//import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
//import { useToast } from "@/hooks/use-toast";

//interface Comment {
//  id: string;
//  author: string;
//  role: "Business" | "Exchange" | "Branch";
//  message: string;
//  timestamp: string;
//  branchName?: string;
//}

//interface TransactionCommentsProps {
//  transactionId: string;
//  userRole: "Business" | "Exchange" | "Branch";
//  userName: string;
//  branchName?: string;
//}

//const TransactionComments = ({
//  transactionId,
//  userRole,
//  userName,
//  branchName,
//}: TransactionCommentsProps) => {
//  const { toast } = useToast();
//  const [newComment, setNewComment] = useState("");
//  const [showConfirmation, setShowConfirmation] = useState(false);

//  // Mock existing comments
//  const [comments, setComments] = useState<Comment[]>([
//    {
//      id: "1",
//      author: "Sarah Wilson",
//      role: "Exchange",
//      message: "Transaction approved and forwarded to processing.",
//      timestamp: "2024-01-16 14:35",
//    },
//    {
//      id: "2",
//      author: "Ahmed Hassan",
//      role: "Branch",
//      message: "All documents verified. KYB status is active.",
//      timestamp: "2024-01-16 14:32",
//      branchName: "Dubai Mall Branch",
//    },
//  ]);

//  const getRoleIcon = (role: string) => {
//    switch (role) {
//      case "Exchange":
//        return <Landmark className="h-3 w-3" />;
//      case "Branch":
//        return <MapPin className="h-3 w-3" />;
//      case "Business":
//        return <Building2 className="h-3 w-3" />;
//      default:
//        return null;
//    }
//  };

//  const getRoleBadgeVariant = (role: string) => {
//    switch (role) {
//      case "Exchange":
//        return "default";
//      case "Branch":
//        return "secondary";
//      case "Business":
//        return "outline";
//      default:
//        return "outline";
//    }
//  };

//  const confirmAddComment = () => {
//    const comment: Comment = {
//      id: Date.now().toString(),
//      author: userName,
//      role: userRole,
//      message: newComment.trim(),
//      timestamp: new Date().toLocaleString("en-US", {
//        year: "numeric",
//        month: "2-digit",
//        day: "2-digit",
//        hour: "2-digit",
//        minute: "2-digit",
//      }),
//      branchName: userRole === "Branch" ? branchName : undefined,
//    };

//    setComments([...comments, comment]);
//    setNewComment("");

//    toast({
//      title: "Comment Added",
//      description: "Your comment has been added to the transaction.",
//    });
//  };

//  const handleAddComment = () => {
//    if (!newComment.trim()) {
//      toast({
//        title: "Error",
//        description: "Comment cannot be empty",
//        variant: "destructive",
//      });
//      return;
//    }
//    setShowConfirmation(true);
//  };

//  const getInitials = (name: string) => {
//    return name
//      .split(" ")
//      .map((n) => n[0])
//      .join("")
//      .toUpperCase()
//      .substring(0, 2);
//  };

//  return (
//    <Card className="shadow-card">
//      <CardHeader>
//        <CardTitle className="flex items-center gap-2 text-lg">
//          <MessageSquare className="h-5 w-5 text-primary" />
//          Transaction Comments
//        </CardTitle>
//      </CardHeader>
//      <CardContent className="space-y-6">
//        {/* Existing Comments */}
//        <div className="space-y-4 max-h-96 overflow-y-auto">
//          {comments.length === 0 ? (
//            <div className="text-center py-8 text-muted-foreground">
//              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
//              <p>No comments yet. Be the first to comment!</p>
//            </div>
//          ) : (
//            comments.map((comment) => (
//              <div
//                key={comment.id}
//                className="flex gap-3 p-4 bg-muted/30 rounded-lg"
//              >
//                <Avatar className="h-10 w-10">
//                  <AvatarFallback className="bg-primary text-primary-foreground">
//                    {getInitials(comment.author)}
//                  </AvatarFallback>
//                </Avatar>
//                <div className="flex-1 space-y-2">
//                  <div className="flex items-center gap-2 flex-wrap">
//                    <span className="font-semibold text-foreground">
//                      {comment.author}
//                    </span>
//                    <Badge
//                      variant={getRoleBadgeVariant(comment.role)}
//                      className="flex items-center gap-1"
//                    >
//                      {getRoleIcon(comment.role)}
//                      {comment.role}
//                    </Badge>
//                    {comment.branchName && (
//                      <span className="text-xs text-muted-foreground">
//                        • {comment.branchName}
//                      </span>
//                    )}
//                    <span className="text-xs text-muted-foreground ml-auto">
//                      {comment.timestamp}
//                    </span>
//                  </div>
//                  <p className="text-sm text-foreground">{comment.message}</p>
//                </div>
//              </div>
//            ))
//          )}
//        </div>

//        {/* Add New Comment */}
//        <div className="space-y-3 pt-4 border-t">
//          <div className="flex items-center gap-2">
//            <Badge
//              variant={getRoleBadgeVariant(userRole)}
//              className="flex items-center gap-1"
//            >
//              {getRoleIcon(userRole)}
//              Commenting as: {userRole}
//            </Badge>
//            {userRole === "Branch" && branchName && (
//              <span className="text-xs text-muted-foreground">
//                ({branchName})
//              </span>
//            )}
//          </div>
//          <Textarea
//            placeholder="Add a comment to this transaction..."
//            value={newComment}
//            onChange={(e) => setNewComment(e.target.value)}
//            rows={3}
//            className="resize-none"
//          />
//          <div className="flex justify-between items-center">
//            <span className="text-xs text-muted-foreground">
//              {newComment.length}/500 characters
//            </span>
//            <Button
//              onClick={handleAddComment}
//              disabled={!newComment.trim()}
//              variant="default"
//            >
//              <Send className="h-4 w-4 mr-2" />
//              Add Comment
//            </Button>
//          </div>
//        </div>
//      </CardContent>

//      <ConfirmationDialog
//        open={showConfirmation}
//        onOpenChange={setShowConfirmation}
//        onConfirm={confirmAddComment}
//        title="Confirm Comment Submission"
//        description="Are you sure you want to add this comment to the transaction? All parties will be able to see this comment."
//        confirmText="Add Comment"
//      />
//    </Card>
//  );
//};

//export default TransactionComments;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Send,
  Building2,
  Landmark,
  MapPin,
  Loader2,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import BASE_URL from "@/config/config";
import { useCookies } from "react-cookie";

interface Comment {
  id: string;
  author: string;
  role: "Business" | "Exchange" | "Branch";
  message: string;
  timestamp: string;
  branchName?: string;
}

interface ApiComment {
  id: number;
  message: string;
  createdByName: string;
  createdByEmail: string;
  role: string;
  branchId: number | null;
  branchName: string | null;
  createdAt: string;
}

interface TransactionCommentsProps {
  transactionId: string;
  userRole: "Business" | "Exchange" | "Branch";
  userName: string;
  branchName?: string;
}

const TransactionComments = ({
  transactionId,
  userRole,
  userName,
  branchName,
}: TransactionCommentsProps) => {
  const { toast } = useToast();
  const [cookies] = useCookies(["token"]);
  const [newComment, setNewComment] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments from API
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/v1/transactions/${transactionId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        },
      );

      if (response.data.status && response.data.data) {
        // Transform API data to match our Comment interface
        const transformedComments: Comment[] = response.data.data.map(
          (apiComment: ApiComment) => ({
            id: apiComment.id.toString(),
            author: apiComment.createdByName || apiComment.createdByEmail,
            role: mapRoleToType(apiComment.role),
            message: apiComment.message,
            timestamp: formatDateTime(apiComment.createdAt),
            branchName: apiComment.branchName || undefined,
          }),
        );
        setComments(transformedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [transactionId, cookies.token]);
  // Helper function to map API role to our role type
  const mapRoleToType = (role: string): "Business" | "Exchange" | "Branch" => {
    const roleMap: Record<string, "Business" | "Exchange" | "Branch"> = {
      BUSINESS: "Business",
      EXCHANGE: "Exchange",
      BRANCH: "Branch",
    };
    return roleMap[role.toUpperCase()] || "Business";
  };

  // Helper function to format date time
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Exchange":
        return <Landmark className="h-3 w-3" />;
      case "Branch":
        return <MapPin className="h-3 w-3" />;
      case "Business":
        return <Building2 className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Exchange":
        return "default";
      case "Branch":
        return "secondary";
      case "Business":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmAddComment = async () => {
    try {
      setIsSubmitting(true);

      // Prepare the request payload based on your API requirements
      const payload = {
        message: newComment.trim(),
        // Add other required fields if needed by your API
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/transactions/${transactionId}/comments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("res", response);
      if (response.data.status) {
        // Add the new comment to the list
        const newCommentObj: Comment = {
          id: Date.now().toString(), // Temporary ID until we refetch
          author: userName,
          role: userRole,
          message: newComment.trim(),
          timestamp: formatDateTime(new Date().toISOString()),
          branchName: userRole === "Branch" ? branchName : undefined,
        };

        setComments([...comments, newCommentObj]);
        setNewComment("");

        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        fetchComments();
        // Optional: Refetch comments to get the actual server data
        // await refetchComments();
      } else {
        throw new Error(response.data.message || "Failed to add comment");
      }
    } catch (error: any) {
      console.error("Error adding comment:", error);
      // toast({
      //   title: "Error",
      //   description: error.response?.data?.message || "Failed to add comment",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          Transaction Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Comments */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-4 bg-muted/30 rounded-lg"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">
                      {comment.author}
                    </span>
                    {comment?.role && (
                      <span className="text-xs text-muted-foreground">
                        • {comment?.role}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Comment */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            {userRole === "Branch" && branchName && (
              <span className="text-xs text-muted-foreground">
                ({branchName})
              </span>
            )}
          </div>
          <Textarea
            placeholder="Add a comment to this transaction..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {newComment.length}/500 characters
            </span>
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
              variant="default"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </div>
      </CardContent>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={confirmAddComment}
        title="Confirm Comment Submission"
        description="Are you sure you want to add this comment to the transaction? All parties will be able to see this comment."
        confirmText={isSubmitting ? "Adding..." : "Add Comment"}
        isConfirming={isSubmitting}
      />
    </Card>
  );
};

export default TransactionComments;
