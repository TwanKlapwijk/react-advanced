import React from "react";
import { Card, CardBody, Text, Stack, CardHeader, Box, Heading } from "@chakra-ui/react";
import { formatDate } from "../FormatDataFn";
export const EventCard = ({ event, categories }) => {
  const filterEventCategories = (categoryIds) => {
    return categories.filter((category) => {
      return categoryIds.includes(category.id);
    });
  };
  const matchedCategories = filterEventCategories(event.categoryIds);

  const eventStartTime = formatDate(event.startTime);
  const eventEndTime = formatDate(event.endTime);

  return (
    <Card height={{ base: "360px" }} width={{ base: "250px" }} borderRadius={"2xl"} overflow={"hidden"}>
      <CardHeader width={"200px"} padding={0}>
        <Box
          backgroundImage={`url(${event.image})`}
          backgroundSize="cover"
          backgroundPosition="center"
          height={{ base: "125px" }}
          width={"250px"}></Box>
      </CardHeader>
      <CardBody
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        padding={"0.25rem"}>
        <Stack spacing={".75rem"}>
          <Heading fontSize={"1.5rem"}>{event.title}</Heading>
          <Text>
            <Text fontSize={"1.1rem"} fontWeight={"500"} as={"span"}>
              Description:
            </Text>{" "}
            {event.description}
          </Text>
          <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} gap={"8px"}>
            <Text fontSize={"1.1rem"} fontWeight={"500"}>
              Categories:{" "}
            </Text>
            {matchedCategories ? (
              matchedCategories.map((category) => (
                <Text fontSize={"1.1rem"} key={category.id}>
                  {category.name}
                </Text>
              ))
            ) : (
              <Text fontWeight={"500"}>No categories found</Text>
            )}
          </Box>
          <Box display={"flex"} justifyContent={"center"} gap={"5px"}>
            <Text fontWeight={"500"}>Starts: {eventStartTime}</Text>
            <Text fontWeight={"500"}>Ends: {eventEndTime}</Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};
