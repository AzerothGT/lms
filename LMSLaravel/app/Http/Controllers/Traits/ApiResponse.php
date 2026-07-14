<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

trait ApiResponse
{
    protected function success($data, string $message = "Success", int $code = 200): JsonResponse
    {
        return response()->json([
            "success" => true,
            "message" => $message,
            "data" => $data,
        ], $code);
    }

    protected function created($data, string $message = "Data berhasil dibuat"): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    protected function error(string $message = "Terjadi kesalahan", int $code = 400): JsonResponse
    {
        return response()->json([
            "success" => false,
            "message" => $message,
        ], $code);
    }

    protected function notFound(string $message = "Data tidak ditemukan"): JsonResponse
    {
        return $this->error($message, 404);
    }

    protected function collectionResponse(ResourceCollection $collection, string $message): JsonResponse
    {
        return $this->success($collection->resolve(), $message);
    }

    protected function resourceResponse(JsonResource $resource, string $message): JsonResponse
    {
        return $this->success($resource->resolve(), $message);
    }
}
