<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CameraController extends AbstractController
{
    /**
     * @Route("/camera", name="camera_index")
     */
    public function map_index(): Response
    {
      return $this->render('camera/index.html.twig', []);
    }

}
